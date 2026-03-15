#!/bin/sh
set -eu

api_url="${VITE_API_URL:-}"
escaped_api_url=$(printf '%s' "$api_url" | sed 's/\\/\\\\/g; s/"/\\"/g')

cat > /usr/share/nginx/html/config.js <<EOF
window.__APP_CONFIG__ = {
  API_URL: "${escaped_api_url}",
};
EOF

exec "$@"
