#!/bin/bash

./web-client/build-dist-public.sh $ENV

# public app
aws s3 sync dist-public s3://${EFCMS_DOMAIN} --delete
aws s3 cp s3://${EFCMS_DOMAIN}/index.html s3://${EFCMS_DOMAIN}/index.html --metadata-directive REPLACE --content-type text/html --cache-control max-age=0

# failover
aws s3 sync dist-public s3://failover.${EFCMS_DOMAIN} --delete --cache-control no-cache
aws s3 cp s3://failover.${EFCMS_DOMAIN}/index.html s3://failover.${EFCMS_DOMAIN}/index.html --metadata-directive REPLACE --content-type text/html --cache-control max-age=0