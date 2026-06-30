#!/usr/bin/env bash
set -e

# Capture the commit SHA before secrets are loaded — load-environment-from-secrets.sh
# sources the deploy secret which can overwrite CIRCLE_SHA1 if that key exists in the
# secret, making RUM_RELEASE_ID empty and breaking source-map deobfuscation.
#
# Must be exported: build-dist-public.sh runs as a child process and bakes
# RUM_RELEASE_ID into the JS bundle as the releaseId reported to RUM. Without the
# export the child cannot see this captured value, re-derives it from the (now
# secrets-clobbered) CIRCLE_SHA1, and the baked releaseId no longer matches the
# S3 folder the .map files are uploaded to below — so RUM can't find the source
# map and stack traces stay minified.
export RUM_RELEASE_ID="${RUM_RELEASE_ID:-$CIRCLE_SHA1}"
# shellcheck disable=SC1091
. ./scripts/load-environment-from-secrets.sh

./check-env-variables.sh \
  "EFCMS_DOMAIN" \
  "ENV" \
  "DEPLOYING_COLOR" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

./web-client/build-dist-public.sh

# CloudWatch RUM source maps for the PUBLIC app. Uploaded to the same private
# bucket as the client app, under the release folder; public bundle names
# (index-public.*) differ from client bundle names so they never collide. The
# public app reports to its own RUM monitor, separate from the client monitor.
RUM_RELEASE_ID="${RUM_RELEASE_ID:-$CIRCLE_SHA1}"
RUM_SOURCEMAP_BUCKET="rum-sourcemaps.${EFCMS_DOMAIN}"
RUM_APP_MONITOR_NAME="${ENV}_dawson_public_rum_app_monitor"
if [ -n "${RUM_RELEASE_ID}" ]; then
  aws s3 cp dist-public "s3://${RUM_SOURCEMAP_BUCKET}/${RUM_RELEASE_ID}/" --recursive --exclude "*" --include "*.map"

  # Prune old source-map releases, keeping only the 2 most recent so the
  # bucket does not grow unbounded during frequent releases. We always retain
  # the previous release alongside the current one to cover the window of a
  # blue/green deployment where the old color may still be serving requests.
  # The S3 lifecycle rule in Terraform is a safety net for any objects that
  # escape this cleanup (e.g. from a failed deploy).
  # Prune source-map releases that are BOTH older than 7 days AND outside the
  # 2 most recent releases. The "last 2" guarantee covers blue/green switchover;
  # the 7-day window retains maps for rollback and incident investigation on
  # low-release-frequency environments without letting the bucket grow unbounded
  # when several deploys happen in a day.
  SOURCEMAP_OBJECTS=$(aws s3api list-objects-v2 \
    --bucket "${RUM_SOURCEMAP_BUCKET}" \
    --query "Contents[].[LastModified,Key]" \
    --output text 2>/dev/null || true)
  # Build a list of "TIMESTAMP PREFIX" sorted oldest-first.
  SORTED_RELEASES_WITH_TS=$(echo "${SOURCEMAP_OBJECTS}" | awk -F'\t' '
    NF==2 {
      prefix = $2; sub("/.*", "", prefix)
      ts = $1
      if (!(prefix in min_ts) || ts < min_ts[prefix]) min_ts[prefix] = ts
    }
    END { for (p in min_ts) print min_ts[p], p }
  ' | sort)
  SOURCEMAP_RELEASE_COUNT=$(echo "${SORTED_RELEASES_WITH_TS}" | grep -c . 2>/dev/null || true)
  if [ "${SOURCEMAP_RELEASE_COUNT}" -gt 2 ]; then
    # ISO 8601 timestamps sort lexicographically, so string comparison works.
    CUTOFF_DATE=$(date -u -d '7 days ago' '+%Y-%m-%dT%H:%M:%S' 2>/dev/null || date -u -v-7d '+%Y-%m-%dT%H:%M:%S')
    PRUNE_COUNT=$((SOURCEMAP_RELEASE_COUNT - 2))
    echo "${SORTED_RELEASES_WITH_TS}" | head -n "${PRUNE_COUNT}" | while IFS=' ' read -r ts old_release; do
      if [ -n "${old_release}" ] && [[ "${ts}" < "${CUTOFF_DATE}" ]]; then
        aws s3 rm "s3://${RUM_SOURCEMAP_BUCKET}/${old_release}/" --recursive
      fi
    done
  fi

  # Terraform is the source of truth for the monitor (it also creates the
  # Cognito identity pool). Only enable unminification if the monitor already
  # exists; otherwise warn and skip so an unapplied environment does not fail
  # the deploy. Done via the CLI because the pinned Terraform AWS provider
  # (6.47.0) does not yet expose deobfuscation_configuration on
  # aws_rum_app_monitor.
  if aws rum get-app-monitor --name "${RUM_APP_MONITOR_NAME}" --region us-east-1 >/dev/null 2>&1; then
    aws rum update-app-monitor \
      --name "${RUM_APP_MONITOR_NAME}" \
      --region us-east-1 \
      --deobfuscation-configuration "{\"JavaScriptSourceMaps\":{\"Status\":\"ENABLED\",\"S3Uri\":\"s3://${RUM_SOURCEMAP_BUCKET}\"}}"
  else
    echo "RUM app monitor ${RUM_APP_MONITOR_NAME} not found; skipping deobfuscation config (apply terraform first)."
  fi
else
  echo "RUM_RELEASE_ID is empty; skipping source map upload and RUM deobfuscation config."
fi

# public app (source maps excluded so original source is never served publicly)
aws s3 sync dist-public "s3://${DEPLOYING_COLOR}.${EFCMS_DOMAIN}" --delete --exclude "*.map"
aws s3 cp "s3://${DEPLOYING_COLOR}.${EFCMS_DOMAIN}/index.html" "s3://${DEPLOYING_COLOR}.${EFCMS_DOMAIN}/index.html" --metadata-directive REPLACE --content-type text/html --cache-control "no-cache, no-store, must-revalidate"

# failover
aws s3 sync dist-public "s3://failover-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}" --delete --cache-control no-cache --exclude "*.map"
aws s3 cp "s3://failover-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}/index.html" "s3://failover-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}/index.html" --metadata-directive REPLACE --content-type text/html --cache-control max-age=0

# invalidate cloudfront cache for this color (public site)
DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Aliases.Items && contains(Aliases.Items, '${DEPLOYING_COLOR}.${EFCMS_DOMAIN}')].Id | [0]" --output text)
if [ -z "${DISTRIBUTION_ID}" ] || [ "${DISTRIBUTION_ID}" = "None" ]; then
  echo "Could not find CloudFront distribution for ${DEPLOYING_COLOR}.${EFCMS_DOMAIN}"
  exit 1
fi
aws cloudfront create-invalidation --distribution-id "${DISTRIBUTION_ID}" --paths "/*"
