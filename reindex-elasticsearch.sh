#!/bin/bash

# Deletes Elasticsearch indices, recreates them, and reindexes all DyanamoDB records

# Usage
#   ./reindex-elasticsearch.sh $ENV $DYNAMO_SOURCE_TABLE $ES_ENDPOINT

# Requirements
#   - terraform must be installed on your machine
#   - aws cli must be installed on your machine
#   - aws credentials must be setup on your machine
#   - node must be setup on your machine

# Arguments
#   - $1 - the environment to clear

[ -z "$1" ] && echo "The environment to reindex must be provided as the \$1 argument." && exit 1
[ -z "$2" ] && echo "The dynamo table name to clear must be provided as the \$2 argument." && exit 1
[ -z "$3" ] && echo "The elasticsearch endpoint to clear must be provided as the \$3 argument." && exit 1
[ -z "${USTC_ADMIN_PASS}" ] && echo "You must have USTC_ADMIN_PASS set in your environment" && exit 1
[ -z "${AWS_ACCESS_KEY_ID}" ] && echo "You must have AWS_ACCESS_KEY_ID set in your environment" && exit 1
[ -z "${AWS_SECRET_ACCESS_KEY}" ] && echo "You must have AWS_SECRET_ACCESS_KEY set in your environment" && exit 1
[ -z "${ZONE_NAME}" ] && echo "You must have ZONE_NAME set in your environment" && exit 1
[ -z "${EFCMS_DOMAIN}" ] && echo "You must have EFCMS_DOMAIN set in your environment" && exit 1

ENV=$1
DYNAMODB_TABLE_NAME=$2
ELASTICSEARCH_ENDPOINT=$3

export ELASTICSEARCH_ENDPOINT

$(which terraform) > /dev/null
if [[ "$?" == "1" ]]; then
  echo "Terraform was not found on your path. Please install terraform."
  exit 1
fi

./web-api/clear-elasticsearch-index.sh $ENV $ELASTICSEARCH_ENDPOINT
./web-api/setup-elasticsearch-index.sh $ENV

pushd web-api
node reindex-dynamodb-records.js $DYNAMODB_TABLE_NAME
popd
