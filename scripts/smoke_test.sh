#!/usr/bin/env bash
set -euo pipefail

# Automated Smoke Test Suite for Target Deployment Environment
# Usage: ./scripts/smoke_test.sh <PORT> <EXPECTED_ENV>

PORT="${1:-8001}"
EXPECTED_ENV="${2:-blue}"
BASE_URL="http://127.0.0.1:${PORT}"

# Portable curl binary selection
if command -v curl.exe >/dev/null 2>&1; then
  CURL_BIN="curl.exe"
else
  CURL_BIN="curl"
fi

echo "=========================================="
echo "Running Smoke Tests against ${BASE_URL} (Target Env: ${EXPECTED_ENV})"
echo "=========================================="

# 1. Test Health Endpoint
echo "[Smoke Test 1/3] Testing Health Endpoint (/health)..."
HEALTH_RES=$(${CURL_BIN} -s -w "\nHTTP_STATUS:%{http_code}" "${BASE_URL}/health")
HEALTH_BODY=$(echo "${HEALTH_RES}" | sed -e 's/HTTP_STATUS:.*//g')
HEALTH_CODE=$(echo "${HEALTH_RES}" | tr -d '\n' | sed -e 's/.*HTTP_STATUS://')

if [ "${HEALTH_CODE}" -ne 200 ] || ! echo "${HEALTH_BODY}" | grep -q '"healthy"'; then
  echo "FAIL: Health endpoint returned HTTP ${HEALTH_CODE}, body: ${HEALTH_BODY}"
  exit 1
fi
echo "PASSED: Health endpoint OK."

# 2. Test Version Endpoint
echo "[Smoke Test 2/3] Testing Version Endpoint (/version)..."
VERSION_RES=$(${CURL_BIN} -s -w "\nHTTP_STATUS:%{http_code}" "${BASE_URL}/version")
VERSION_BODY=$(echo "${VERSION_RES}" | sed -e 's/HTTP_STATUS:.*//g')
VERSION_CODE=$(echo "${VERSION_RES}" | tr -d '\n' | sed -e 's/.*HTTP_STATUS://')

if [ "${VERSION_CODE}" -ne 200 ] || ! echo "${VERSION_BODY}" | grep -qi "${EXPECTED_ENV}"; then
  echo "FAIL: Version endpoint returned HTTP ${VERSION_CODE}, expected env '${EXPECTED_ENV}'. Body: ${VERSION_BODY}"
  exit 1
fi
echo "PASSED: Version endpoint matched target environment '${EXPECTED_ENV}'."

# 3. Test Task CRUD Endpoint Workflow
echo "[Smoke Test 3/3] Testing Task CRUD Workflow (/api/tasks)..."
TEST_TITLE="SmokeTest_$(date +%s)"
CREATE_PAYLOAD="{\"title\":\"${TEST_TITLE}\",\"description\":\"Automated smoke test verification\",\"status\":\"TODO\"}"

CREATE_RES=$(${CURL_BIN} -s -X POST -H "Content-Type: application/json" -d "${CREATE_PAYLOAD}" -w "\nHTTP_STATUS:%{http_code}" "${BASE_URL}/api/tasks")
CREATE_BODY=$(echo "${CREATE_RES}" | sed -e 's/HTTP_STATUS:.*//g')
CREATE_CODE=$(echo "${CREATE_RES}" | tr -d '\n' | sed -e 's/.*HTTP_STATUS://')

if [ "${CREATE_CODE}" -ne 201 ]; then
  echo "FAIL: Task creation returned HTTP ${CREATE_CODE}. Body: ${CREATE_BODY}"
  exit 1
fi

TASK_ID=$(echo "${CREATE_BODY}" | grep -o '"id":[0-9]*' | grep -o '[0-9]*' || true)
if [ -z "${TASK_ID}" ]; then
  echo "FAIL: Could not extract task ID from creation response: ${CREATE_BODY}"
  exit 1
fi
echo "Created test task #${TASK_ID} successfully."

# Verify Read
GET_RES=$(${CURL_BIN} -s -w "\nHTTP_STATUS:%{http_code}" "${BASE_URL}/api/tasks/${TASK_ID}")
GET_CODE=$(echo "${GET_RES}" | tr -d '\n' | sed -e 's/.*HTTP_STATUS://')
if [ "${GET_CODE}" -ne 200 ]; then
  echo "FAIL: Task GET returned HTTP ${GET_CODE} for ID #${TASK_ID}."
  exit 1
fi

# Clean up created test task
DELETE_RES=$(${CURL_BIN} -s -X DELETE -w "\nHTTP_STATUS:%{http_code}" "${BASE_URL}/api/tasks/${TASK_ID}")
DELETE_CODE=$(echo "${DELETE_RES}" | tr -d '\n' | sed -e 's/.*HTTP_STATUS://')
if [ "${DELETE_CODE}" -ne 204 ] && [ "${DELETE_CODE}" -ne 200 ]; then
  echo "WARNING: Task cleanup returned HTTP ${DELETE_CODE} for ID #${TASK_ID}."
fi

echo "PASSED: Task CRUD API workflow verified successfully."
echo "=========================================="
echo "ALL SMOKE TESTS PASSED FOR ${EXPECTED_ENV} ENVIRONMENT!"
echo "=========================================="
exit 0
