#!/bin/bash

# This script assumes you have already created the necessary roles and policies to
# allow ES to backup & restore into an s3 bucket

# Before running, make sure you have started aws-es-proxy
# brew install aws-es-proxy
# aws-es-proxy -endpoint $ENDPOINT

# Before running, make sure a snapshot repository was created
#  curl -XPUT 'http://localhost:9200/_snapshot/snapshot-repository' -H "Content-Type: application/json" -d'{
#    "type": "s3",
#    "settings": {
#       "bucket": "$ENV-es-snapshots-flexion.us",
#       "region": "us-east-1",
#       "role_arn": "arn:aws:iam::ACCOUNT_ID:role/es-snapshots-flexion.us"
#    }
#  }'

# This script assumes you have already created the necessary roles and policies to
# allow ES to backup & restore into an s3 bucket

curl -XPOST 'http://localhost:9200/_snapshot/snapshot-repository/main-snapshot/_restore' -H "Content-Type: application/json" -d'{
  "indices": ["efcms-work-item", "efcms-user", "efcms-case", "efcms-docket-entry", "efcms-case-deadline", "efcms-message"],
  "ignore_unavailable": false,
  "include_global_state": false
}'
