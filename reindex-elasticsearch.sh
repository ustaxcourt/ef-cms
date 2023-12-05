#!/bin/bash -e

# Deletes Elasticsearch indices, recreates them, and reindexes all DyanamoDB records

# Usage
#   ./reindex-elasticsearch.sh

( ! command -v aws > /dev/null ) && echo "aws was not found on your path. Please install aws." && exit 1
( ! command -v terraform > /dev/null ) && echo "terraform was not found on your path. Please install terraform." && exit 1
( ! command -v node > /dev/null ) && echo "node was not found on your path. Please install node." && exit 1

./check-env-variables.sh \
  "ENV" \
  "DYNAMODB_TABLE_NAME" \
  "ELASTICSEARCH_ENDPOINT" \
  "ZONE_NAME" \
  "EFCMS_DOMAIN" \
  "USTC_ADMIN_PASS" \
  "AWS_ACCESS_KEY_ID" \
  "AWS_SECRET_ACCESS_KEY"

./web-api/clear-elasticsearch-index.sh "${ENV}" "${ELASTICSEARCH_ENDPOINT}"
./web-api/setup-elasticsearch-index.sh "${ENV}"
./web-api/setup-elasticsearch-aliases.sh "${ENV}"

pushd web-api
node reindex-dynamodb-records.js "${DYNAMODB_TABLE_NAME}"
popd
