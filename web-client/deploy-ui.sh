#!/bin/bash -e

# shellcheck disable=SC1091
. ./scripts/load-environment-from-secrets.sh

[ -z "${EFCMS_DOMAIN}" ] && echo "You must have EFCMS_DOMAIN set in your environment" && exit 1
[ -z "${DEPLOYING_COLOR}" ] && echo "You must have DEPLOYING_COLOR set in your environment" && exit 1
[ -z "${ENV}" ] && echo "You must have ENV set in your environment" && exit 1

./web-client/build-dist.sh "${ENV}" "${DEPLOYING_COLOR}"

# private app
aws s3 sync dist "s3://app-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}" --delete
aws s3 cp "s3://app-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}/index.html" "s3://app-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}/index.html" --metadata-directive REPLACE --content-type text/html --cache-control max-age=0

# failover
aws s3 sync dist "s3://app-failover-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}" --delete --cache-control no-cache
aws s3 cp "s3://app-failover-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}/index.html" "s3://app-failover-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}/index.html" --metadata-directive REPLACE --content-type text/html --cache-control max-age=0

# invalidate cloudfront cache for this color
PRIVATE_DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Aliases.Items && contains(Aliases.Items, 'app-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}')].Id | [0]" --output text)
if [ -n "${PRIVATE_DISTRIBUTION_ID}" ] && [ "${PRIVATE_DISTRIBUTION_ID}" != "None" ]; then
  echo "Creating CloudFront invalidation for distribution ${PRIVATE_DISTRIBUTION_ID}..."
  INVALIDATION_ID=$(aws cloudfront create-invalidation --distribution-id "${PRIVATE_DISTRIBUTION_ID}" --paths "/*" --query "Invalidation.Id" --output text)
  echo "Invalidation ${INVALIDATION_ID} created. Waiting for completion..."
  aws cloudfront wait invalidation-completed --distribution-id "${PRIVATE_DISTRIBUTION_ID}" --id "${INVALIDATION_ID}"
  echo "Invalidation ${INVALIDATION_ID} completed."
else
  echo "No CloudFront distribution found for app-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}, skipping invalidation."
fi
