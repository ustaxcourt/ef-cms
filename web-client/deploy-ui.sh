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
