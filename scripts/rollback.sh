#!/usr/bin/env bash
set -euo pipefail

# Rollback Script for Blue-Green Deployment
# Usage: ./scripts/rollback.sh <PREVIOUS_ACTIVE_ENV> [INACTIVE_ENV_TO_CLEAN]

PREVIOUS_ENV="$(echo "${1:-blue}" | tr '[:upper:]' '[:lower:]')"
FAILED_ENV="${2:-}"

echo "=========================================="
echo "ALERT: INITIATING AUTOMATED ROLLBACK TO ${PREVIOUS_ENV}!"
echo "=========================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Revert traffic to PREVIOUS_ENV using switch_traffic.sh
"${SCRIPT_DIR}/switch_traffic.sh" "${PREVIOUS_ENV}"

# If an inactive environment failed, stop its containers
if [ -n "${FAILED_ENV}" ]; then
  echo "Cleaning up failed target environment: ${FAILED_ENV}..."
  "${SCRIPT_DIR}/cleanup.sh" "${FAILED_ENV}"
fi

echo "=========================================="
echo "ROLLBACK COMPLETE! Traffic safely routed back to ${PREVIOUS_ENV}."
echo "=========================================="
exit 0
