#!/usr/bin/env bash
set -euo pipefail

# Traffic Switch Script for Blue-Green Deployment
# Usage: ./scripts/switch_traffic.sh <blue|green>

TARGET_ENV="$(echo "${1:-blue}" | tr '[:upper:]' '[:lower:]')"

if [ "${TARGET_ENV}" != "blue" ] && [ "${TARGET_ENV}" != "green" ]; then
  echo "ERROR: Invalid target environment '${TARGET_ENV}'. Must be 'blue' or 'green'."
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
ACTIVE_CONF="${PROJECT_ROOT}/nginx/active.conf"

echo "=========================================="
echo "Switching Nginx Traffic Router to: ${TARGET_ENV}"
echo "=========================================="

# Update active.conf content
echo "# Active Environment Configuration - Currently $(echo "${TARGET_ENV}" | tr '[:lower:]' '[:upper:]')" > "${ACTIVE_CONF}"
echo "include /etc/nginx/conf.d/${TARGET_ENV}.conf;" >> "${ACTIVE_CONF}"

echo "Updated ${ACTIVE_CONF} to reference ${TARGET_ENV}.conf."

# Reload Nginx container if running
if command -v docker >/dev/null 2>&1 && docker ps | grep -q "nginx-router"; then
  echo "Validating Nginx configuration inside container..."
  docker exec nginx-router nginx -t

  echo "Reloading Nginx gracefully (zero-downtime switch)..."
  docker exec nginx-router nginx -s reload
  echo "SUCCESS: Nginx reloaded successfully. Traffic now pointing to ${TARGET_ENV}."
else
  echo "NOTICE: Nginx container is not currently running. Active configuration file saved."
fi

exit 0
