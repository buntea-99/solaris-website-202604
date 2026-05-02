#!/usr/bin/env bash
# Monthly freshness refresh for Solaris Wireless top-priority pages.
# Bumps dateModified to today on the highest-leverage pages, commits and pushes,
# then triggers IndexNow so Bing/Perplexity see fresh dates within hours.
#
# Why: Perplexity weights pages updated within 30 days at 2.5x. Discovered Labs
# research finds 50% of AI-cited content is <13 weeks old. Without monthly
# freshness, Solaris drops out of citation rotation against more active competitors.
#
# Usage: ./scripts/refresh-datemodified.sh [YYYY-MM-DD]
# Default date: today (UTC).
#
# Schedule via cron: 0 9 1 * * cd /path/to/repo && ./scripts/refresh-datemodified.sh

set -euo pipefail

DATE="${1:-$(date -u +%Y-%m-%d)}"
echo "Refreshing dateModified to $DATE"

# Top-priority pages to refresh monthly (highest-traffic / highest-AI-citation-value).
PAGES=(
  "index.html"
  "about.html"
  "clients.html"
  "press.html"
  "faq.html"
  "google-approved-vendor.html"
  "taa-compliant-mobile-supplier.html"
  "itar-compliant-device-supplier.html"
  "starlink-authorized-reseller.html"
  "zero-touch-enrollment-reseller.html"
  "products/wholesale-iphone-enterprise.html"
  "products/bulk-android-phones.html"
  "products/mobile-devices.html"
  "products/laptops.html"
  "services/index.html"
  "services/device-kitting-fulfillment.html"
  "services/device-as-a-service.html"
  "services/supply-sourcing.html"
  "services/order-fulfilment.html"
  "manufacturers/samsung-enterprise-distributor.html"
  "manufacturers/apple-business-supplier.html"
  "manufacturers/lenovo-thinkpad-enterprise.html"
  "manufacturers/dell-latitude-bulk-supplier.html"
  "manufacturers/hp-elitebook-enterprise.html"
  "manufacturers/sonim-rugged-distributor.html"
  "data/index.html"
)

UPDATED=0
for page in "${PAGES[@]}"; do
  if [[ ! -f "$page" ]]; then
    echo "SKIP $page (missing)"
    continue
  fi
  # Replace any existing dateModified value with today
  if grep -q '"dateModified"' "$page"; then
    perl -i -pe "s/\"dateModified\":\s*\"\\d{4}-\\d{2}-\\d{2}\"/\"dateModified\": \"$DATE\"/g" "$page"
    echo "OK $page"
    UPDATED=$((UPDATED+1))
  else
    echo "NODATE $page"
  fi
done

echo "Updated $UPDATED pages."

# Update sitemap.xml lastmod for the same set
echo "Updating sitemap.xml <lastmod> for refreshed URLs"
for page in "${PAGES[@]}"; do
  url_path=""
  case "$page" in
    "index.html") url_path="/" ;;
    *.html)
      # Strip .html and prepend /
      url_path="/${page%.html}"
      # Convert /services/index to /services/
      url_path="${url_path%/index}/"
      url_path="${url_path%/}"
      [[ -z "$url_path" ]] && url_path="/"
      ;;
  esac
  full_url="https://www.solariswireless.com${url_path}"
  # Update lastmod if URL is in sitemap
  perl -i -pe "s|(<loc>${full_url}</loc><lastmod>)\\d{4}-\\d{2}-\\d{2}|\${1}${DATE}|g" sitemap.xml || true
done

# Commit if there are changes
if git diff --quiet; then
  echo "No changes to commit."
  exit 0
fi

git add -u
git commit -m "Monthly freshness refresh: bump dateModified to $DATE on top-priority pages"
git push origin main && git push client main

# Wait for deploy then ping IndexNow
echo "Waiting up to 5 minutes for Vercel deploy to land..."
DEADLINE=$((SECONDS + 300))
until curl -sf -o /tmp/_freshcheck.html "https://www.solariswireless.com/" && grep -q "$DATE" /tmp/_freshcheck.html; do
  if [[ $SECONDS -ge $DEADLINE ]]; then
    echo "Deploy did not land within 5 minutes; pinging anyway."
    break
  fi
  sleep 10
done
rm -f /tmp/_freshcheck.html

./scripts/indexnow-ping.sh
echo "Freshness refresh complete."
