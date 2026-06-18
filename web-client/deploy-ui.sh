#!/usr/bin/env bash
set -e

# Capture the commit SHA before secrets are loaded — load-environment-from-secrets.sh
# sources the deploy secret which can overwrite CIRCLE_SHA1 if that key exists in the
# secret, making RUM_RELEASE_ID empty and breaking source-map deobfuscation.
RUM_RELEASE_ID="${RUM_RELEASE_ID:-$CIRCLE_SHA1}"
echo "Dummy $CIRCLE_SHA1"

# shellcheck disable=SC1091
. ./scripts/load-environment-from-secrets.sh

[ -z "${EFCMS_DOMAIN}" ] && echo "You must have EFCMS_DOMAIN set in your environment" && exit 1
[ -z "${DEPLOYING_COLOR}" ] && echo "You must have DEPLOYING_COLOR set in your environment" && exit 1
[ -z "${ENV}" ] && echo "You must have ENV set in your environment" && exit 1

./web-client/build-dist.sh "${ENV}" "${DEPLOYING_COLOR}"

# CloudWatch RUM source maps: upload the build's `.map` files to a PRIVATE
# bucket under a folder named for the releaseId so RUM can unminify stack
# traces. The releaseId must match the one baked into the client at build time
# (build-dist.sh). Source maps are deliberately kept out of the public app
# buckets below (--exclude "*.map") so original source is never served publicly.
RUM_RELEASE_ID="${RUM_RELEASE_ID:-$CIRCLE_SHA1}"
RUM_SOURCEMAP_BUCKET="rum-sourcemaps.${EFCMS_DOMAIN}"
# The client (private) app reports to its own RUM monitor. The public app has a
# separate monitor (see deploy-public.sh). Both apps share this source-map
# bucket; their bundle names differ (index.* vs index-public.*) so they do not
# collide within a release folder.
RUM_APP_MONITOR_NAME="${ENV}_dawson_rum_app_monitor"
if [ -n "${RUM_RELEASE_ID}" ]; then
  aws s3 cp dist "s3://${RUM_SOURCEMAP_BUCKET}/${RUM_RELEASE_ID}/" --recursive --exclude "*" --include "*.map"

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

# private app (source maps excluded so they are never served from the public CDN)
aws s3 sync dist "s3://app-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}" --delete --exclude "*.map"
aws s3 cp "s3://app-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}/index.html" "s3://app-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}/index.html" --metadata-directive REPLACE --content-type text/html --cache-control "no-cache, no-store, must-revalidate"

# failover
aws s3 sync dist "s3://app-failover-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}" --delete --cache-control no-cache --exclude "*.map"
aws s3 cp "s3://app-failover-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}/index.html" "s3://app-failover-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}/index.html" --metadata-directive REPLACE --content-type text/html --cache-control max-age=0

# invalidate cloudfront cache for this color
DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Aliases.Items && contains(Aliases.Items, 'app-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}')].Id | [0]" --output text)
if [ -z "${DISTRIBUTION_ID}" ] || [ "${DISTRIBUTION_ID}" = "None" ]; then
  echo "Could not find CloudFront distribution for app-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}"
  exit 1
fi
aws cloudfront create-invalidation --distribution-id "${DISTRIBUTION_ID}" --paths "/*"
