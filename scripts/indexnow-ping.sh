#!/usr/bin/env bash
# IndexNow ping for Solaris Wireless
# Usage: ./scripts/indexnow-ping.sh
# Submits the full sitemap URL set to IndexNow (Bing, Yandex, Seznam, others).
# Safe to run on every deploy. The IndexNow protocol is rate-limit-tolerant.

set -euo pipefail

KEY="b3ebb527682d352bfa2973e03befa11e"
HOST="www.solariswireless.com"
KEY_LOCATION="https://${HOST}/${KEY}.txt"

# Extract every <loc> from sitemap.xml as a JSON array
URLS=$(grep -oE '<loc>[^<]+</loc>' sitemap.xml \
  | sed -E 's|<loc>(.+)</loc>|\1|' \
  | python3 -c "import sys, json; print(json.dumps([u.strip() for u in sys.stdin if u.strip()]))")

PAYLOAD=$(python3 -c "
import json, sys
urls = $URLS
print(json.dumps({
    'host': '${HOST}',
    'key': '${KEY}',
    'keyLocation': '${KEY_LOCATION}',
    'urlList': urls
}))")

echo "Submitting $(python3 -c "import json; print(len(json.loads('''$URLS''')))") URLs to IndexNow..."

curl -sS -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "$PAYLOAD" \
  -w "\nHTTP %{http_code}\n"

echo "IndexNow submission complete."
