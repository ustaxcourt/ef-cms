#!/bin/bash

[ -z "${EFCMS_DOMAIN}" ] && echo "You must have EFCMS_DOMAIN set in your environment" && exit 1
[ -z "${DEPLOYING_COLOR}" ] && echo "You must have DEPLOYING_COLOR set in your environment" && exit 1
[ -z "${ENV}" ] && echo "You must have ENV set in your environment" && exit 1

./scripts/build-dist-public.sh $ENV $DEPLOYING_COLOR

# public app
aws s3 sync dist-public s3://${DEPLOYING_COLOR}.${EFCMS_DOMAIN} --delete
aws s3 cp s3://${DEPLOYING_COLOR}.${EFCMS_DOMAIN}/index.html s3://${DEPLOYING_COLOR}.${EFCMS_DOMAIN}/index.html --metadata-directive REPLACE --content-type text/html --cache-control max-age=0

# failover
aws s3 sync dist-public s3://failover-${DEPLOYING_COLOR}.${EFCMS_DOMAIN} --delete --cache-control no-cache
aws s3 cp s3://failover-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}/index.html s3://failover-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}/index.html --metadata-directive REPLACE --content-type text/html --cache-control max-age=0
