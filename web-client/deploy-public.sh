#!/bin/bash -e

# shellcheck disable=SC1091
. ./scripts/load-environment-from-secrets.sh

./check-env-variables.sh \
  "EFCMS_DOMAIN" \
  "ENV" \
  "DEPLOYING_COLOR" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

./web-client/build-dist-public.sh

# public app
aws s3 sync dist-public "s3://${DEPLOYING_COLOR}.${EFCMS_DOMAIN}" --delete
aws s3 cp "s3://${DEPLOYING_COLOR}.${EFCMS_DOMAIN}/index.html" "s3://${DEPLOYING_COLOR}.${EFCMS_DOMAIN}/index.html" --metadata-directive REPLACE --content-type text/html --cache-control max-age=0

# failover
aws s3 sync dist-public "s3://failover-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}" --delete --cache-control no-cache
aws s3 cp "s3://failover-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}/index.html" "s3://failover-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}/index.html" --metadata-directive REPLACE --content-type text/html --cache-control max-age=0

# invalidate cloudfront cache for this color (public site)
PUBLIC_DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Aliases.Items && contains(Aliases.Items, '${DEPLOYING_COLOR}.${EFCMS_DOMAIN}')].Id | [0]" --output text)
if [ -n "${PUBLIC_DISTRIBUTION_ID}" ] && [ "${PUBLIC_DISTRIBUTION_ID}" != "None" ]; then
  echo "Creating CloudFront invalidation for distribution ${PUBLIC_DISTRIBUTION_ID}..."
  INVALIDATION_ID=$(aws cloudfront create-invalidation --distribution-id "${PUBLIC_DISTRIBUTION_ID}" --paths "/*" --query "Invalidation.Id" --output text)
  echo "Invalidation ${INVALIDATION_ID} created. Waiting for completion..."
  aws cloudfront wait invalidation-completed --distribution-id "${PUBLIC_DISTRIBUTION_ID}" --id "${INVALIDATION_ID}"
  echo "Invalidation ${INVALIDATION_ID} completed."
else
  echo "No CloudFront distribution found for ${DEPLOYING_COLOR}.${EFCMS_DOMAIN}, skipping invalidation."
fi
