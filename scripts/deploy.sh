#!/usr/bin/env bash
set -euo pipefail

# Master Zero-Downtime Blue-Green Deployment Orchestrator
# Usage: ./scripts/deploy.sh [VERSION_TAG]

VERSION_TAG="${1:-1.1.0}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
ACTIVE_CONF="${PROJECT_ROOT}/nginx/active.conf"

echo "=========================================================================="
echo "STARTING ZERO-DOWNTIME BLUE-GREEN DEPLOYMENT (Version: ${VERSION_TAG})"
echo "=========================================================================="

# 1. Detect Active Environment
CURRENT_ACTIVE="blue"
if [ -f "${ACTIVE_CONF}" ] && grep -qi "green" "${ACTIVE_CONF}"; then
  CURRENT_ACTIVE="green"
fi

if [ "${CURRENT_ACTIVE}" == "blue" ]; then
  TARGET_ENV="green"
  TARGET_PORT="8002"
else
  TARGET_ENV="blue"
  TARGET_PORT="8001"
fi

echo "Detected Current Active Environment : ${CURRENT_ACTIVE^^}"
echo "Target Inactive Environment for Release: ${TARGET_ENV^^} (Port ${TARGET_PORT})"
echo "=========================================================================="

# 2. Deploy Target Environment Containers
echo "[STEP 1/5] Building & Launching Target Container Stack (${TARGET_ENV^^})..."
if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
  export "${TARGET_ENV^^}_APP_VERSION=${VERSION_TAG}"
  docker compose -f "${PROJECT_ROOT}/docker-compose.yml" up -d --build "backend-${TARGET_ENV}" "frontend-${TARGET_ENV}"
else
  echo "NOTICE: Docker daemon not active locally. Simulating target environment launch for verification."
fi

# 3. Execute Automated Health Checks
echo "[STEP 2/5] Executing Container Health Checks on Target (Port ${TARGET_PORT})..."
if ! "${SCRIPT_DIR}/health_check.sh" "${TARGET_PORT}" 12 5; then
  echo "CRITICAL: Health check failed on target environment ${TARGET_ENV^^}!"
  echo "Triggering pre-switch rollback procedure..."
  "${SCRIPT_DIR}/rollback.sh" "${CURRENT_ACTIVE}" "${TARGET_ENV}"
  exit 1
fi

# 4. Execute Automated Smoke Tests
echo "[STEP 3/5] Executing Smoke Tests against Target Environment (${TARGET_ENV^^})..."
if ! "${SCRIPT_DIR}/smoke_test.sh" "${TARGET_PORT}" "${TARGET_ENV}"; then
  echo "CRITICAL: Smoke test suite failed on target environment ${TARGET_ENV^^}!"
  echo "Triggering pre-switch rollback procedure..."
  "${SCRIPT_DIR}/rollback.sh" "${CURRENT_ACTIVE}" "${TARGET_ENV}"
  exit 1
fi

# 5. Switch Nginx Traffic
echo "[STEP 4/5] Switching Nginx Traffic from ${CURRENT_ACTIVE^^} to ${TARGET_ENV^^}..."
if ! "${SCRIPT_DIR}/switch_traffic.sh" "${TARGET_ENV}"; then
  echo "CRITICAL: Traffic switch failed! Triggering emergency rollback..."
  "${SCRIPT_DIR}/rollback.sh" "${CURRENT_ACTIVE}" "${TARGET_ENV}"
  exit 1
fi

# 6. Post-Switch Verification
echo "[STEP 5/5] Performing Post-Deployment Traffic Switch Verification..."
echo "Verifying active environment updated in Nginx..."
if grep -qi "${TARGET_ENV}" "${ACTIVE_CONF}"; then
  echo "CONFIRMED: Traffic successfully routed to ${TARGET_ENV^^}."
else
  echo "CRITICAL: Active configuration check failed!"
  "${SCRIPT_DIR}/rollback.sh" "${CURRENT_ACTIVE}" "${TARGET_ENV}"
  exit 1
fi

echo "=========================================================================="
echo "DEPLOYMENT SUCCESSFUL! ZERO-DOWNTIME RELEASE COMPLETED FOR ${TARGET_ENV^^} (v${VERSION_TAG})."
echo "Active Production Environment: ${TARGET_ENV^^}"
echo "Previous Standby Environment : ${CURRENT_ACTIVE^^}"
echo "=========================================================================="
exit 0
