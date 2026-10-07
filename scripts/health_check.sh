#!/usr/bin/env bash
set -euo pipefail

# Health Check Script for Blue-Green Deployment
# Usage: ./scripts/health_check.sh <PORT> [MAX_RETRIES] [RETRY_INTERVAL]

PORT="${1:-8001}"
MAX_RETRIES="${2:-12}"
RETRY_INTERVAL="${3:-5}"
HEALTH_URL="http://127.0.0.1:${PORT}/health"

# Portable curl binary selection
if command -v curl.exe >/dev/null 2>&1; then
  CURL_BIN="curl.exe"
else
  CURL_BIN="curl"
fi

echo "=========================================="
echo "Running Health Check against port ${PORT}..."
echo "Target URL: ${HEALTH_URL}"
echo "=========================================="

count=0
until [ "${count}" -ge "${MAX_RETRIES}" ]; do
  count=$((count + 1))
  echo "[Attempt ${count}/${MAX_RETRIES}] Checking ${HEALTH_URL}..."

  RESPONSE=$(${CURL_BIN} -s -w "\nHTTP_STATUS:%{http_code}" "${HEALTH_URL}" || true)
  HTTP_BODY=$(echo "${RESPONSE}" | sed -e 's/HTTP_STATUS:.*//g')
  HTTP_STATUS=$(echo "${RESPONSE}" | tr -d '\n' | sed -e 's/.*HTTP_STATUS://')

  if [ "${HTTP_STATUS}" -eq 200 ] && echo "${HTTP_BODY}" | grep -q '"healthy"'; then
    echo "SUCCESS: Health check passed on port ${PORT}! Response: ${HTTP_BODY}"
    exit 0
  fi

  echo "WARNING: Health check not ready (HTTP ${HTTP_STATUS}). Retrying in ${RETRY_INTERVAL}s..."
  sleep "${RETRY_INTERVAL}"
done

echo "ERROR: Health check failed on port ${PORT} after ${MAX_RETRIES} attempts."
exit 1
