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
