#!/usr/bin/env bash
# Inject IPTC metadata (creator, credit, license) into Solaris Wireless flagship images.
#
# Why: Reports 1 and 3 — Google's "About this image" feature surfaces IPTC and C2PA
# metadata. AI engines weight images with proper attribution as more credible. Flagship
# product hero images sourced from Pexels currently carry no Solaris attribution.
#
# Prerequisites:
#   brew install exiftool
#
# Usage: ./scripts/iptc-metadata-injection.sh
# Idempotent: safe to re-run; overwrites existing IPTC fields.

set -euo pipefail

if ! command -v exiftool &> /dev/null; then
  echo "exiftool not installed. Install with: brew install exiftool"
  exit 1
fi

# IPTC fields to inject across flagship images
CREATOR="Solaris Wireless LLC"
COPYRIGHT="© 2026 Solaris Wireless LLC. All rights reserved."
CREDIT="Solaris Wireless"
USAGE_TERMS="https://www.solariswireless.com/legal/terms"
WEB_STATEMENT="https://www.solariswireless.com/"

# Apply to all images in /images/og/ (custom-generated brand cards we control)
for img in images/og/*.jpg; do
  [[ ! -f "$img" ]] && continue
  exiftool -overwrite_original \
    -IPTC:By-line="$CREATOR" \
    -IPTC:Credit="$CREDIT" \
    -IPTC:CopyrightNotice="$COPYRIGHT" \
    -EXIF:Artist="$CREATOR" \
    -EXIF:Copyright="$COPYRIGHT" \
    -XMP:Creator="$CREATOR" \
    -XMP:Credit="$CREDIT" \
    -XMP:Rights="$COPYRIGHT" \
    -XMP:UsageTerms="$USAGE_TERMS" \
    -XMP:WebStatement="$WEB_STATEMENT" \
    "$img" 2>&1 | grep -v "^$" || true
done

echo "IPTC metadata injection complete on all images/og/ files."
echo "To verify: exiftool images/og/home.jpg | grep -E 'By-line|Copyright|Credit|Creator'"
