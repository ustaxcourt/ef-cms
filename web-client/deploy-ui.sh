#!/bin/bash

./web-client/build-dist.sh $ENV

# private app
aws s3 sync dist s3://app.${EFCMS_DOMAIN} --delete
aws s3 cp s3://app.${EFCMS_DOMAIN}/index.html s3://app.${EFCMS_DOMAIN}/index.html --metadata-directive REPLACE --content-type text/html --cache-control max-age=0

# failover
aws s3 sync dist s3://app-failover.${EFCMS_DOMAIN} --delete --cache-control no-cache
aws s3 cp s3://app-failover.${EFCMS_DOMAIN}/index.html s3://app-failover.${EFCMS_DOMAIN}/index.html --metadata-directive REPLACE --content-type text/html --cache-control max-age=0