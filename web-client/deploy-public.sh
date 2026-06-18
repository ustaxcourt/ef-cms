#!/usr/bin/env bash
set -e

# Capture the commit SHA before secrets are loaded — load-environment-from-secrets.sh
# sources the deploy secret which can overwrite CIRCLE_SHA1 if that key exists in the
# secret, making RUM_RELEASE_ID empty and breaking source-map deobfuscation.
RUM_RELEASE_ID="${RUM_RELEASE_ID:-$CIRCLE_SHA1}"
echo "Dummy $CIRCLE_SHA1"
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
