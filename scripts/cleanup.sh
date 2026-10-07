#!/usr/bin/env bash
set -euo pipefail

# Cleanup Script for Retired Environment
# Usage: ./scripts/cleanup.sh <ENV_TO_CLEAN>

ENV_TO_CLEAN="$(echo "${1:-green}" | tr '[:upper:]' '[:lower:]')"

if [ "${ENV_TO_CLEAN}" != "blue" ] && [ "${ENV_TO_CLEAN}" != "green" ]; then
  echo "ERROR: Invalid environment '${ENV_TO_CLEAN}'. Must be 'blue' or 'green'."
  exit 1
fi

echo "=========================================="
echo "Running Cleanup for Environment: ${ENV_TO_CLEAN}"
echo "=========================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

if command -v docker >/dev/null 2>&1 && docker ps | grep -q "backend-${ENV_TO_CLEAN}"; then
  echo "Stopping and removing containers for ${ENV_TO_CLEAN} environment..."
  docker compose -f "${PROJECT_ROOT}/docker-compose.yml" stop "backend-${ENV_TO_CLEAN}" "frontend-${ENV_TO_CLEAN}" || true
  docker compose -f "${PROJECT_ROOT}/docker-compose.yml" rm -f "backend-${ENV_TO_CLEAN}" "frontend-${ENV_TO_CLEAN}" || true
  echo "Containers for ${ENV_TO_CLEAN} removed successfully."
else
  echo "NOTICE: No active containers found for ${ENV_TO_CLEAN} environment."
fi

exit 0
