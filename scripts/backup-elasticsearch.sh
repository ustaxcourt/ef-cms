#!/bin/bash

# Arguments
#   - $1 - the environment to clear
#   - $2 - the aws account id

[ -z "$1" ] && echo "The ENV must be provided as the \$1 argument." && exit 1
[ -z "$2" ] && echo "The AWS_ACCOUNT_ID must be provided as the \$2 argument." && exit 1

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
curl -XPUT 'http://localhost:9200/_snapshot/snapshot-repository' -H "Content-Type: application/json" -d'{
   "type": "s3",
   "settings": {
      "bucket": "'${ENV}'-es-snapshots-flexion.us",
      "region": "us-east-1",
      "role_arn": "arn:aws:iam::'${AWS_ACCOUNT_ID}':role/es-snapshots-flexion.us"
   }
 }' 

# Backup the index
curl -XPUT "http://localhost:9200/_snapshot/snapshot-repository/main-snapshot" -H "Content-Type: application/json" -d'{
  "indices": ["efcms-work-item", "efcms-user", "efcms-case", "efcms-user-case", "efcms-docket-entry", "efcms-case-deadline", "efcms-message"],
  "ignore_unavailable": true,
  "include_global_state": false
}'

# You can run this to figure out when it is done
# curl -XGET localhost:9200/_snapshot/snapshot-repository/_status

