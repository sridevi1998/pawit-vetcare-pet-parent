#!/bin/sh
set -eu

cat > /usr/share/nginx/html/config.js <<EOF
window.__PAWIT_CONFIG__ = {
  apiBaseUrl: "${VITE_API_BASE_URL:-}",
  tenantId: "${VITE_PAWIT_TENANT_ID:-}",
  userId: "${VITE_PAWIT_USER_ID:-}",
  role: "${VITE_PAWIT_ROLE:-PetParent}"
};
EOF
