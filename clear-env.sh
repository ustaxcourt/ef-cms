#!/bin/bash -e

# Deletes existing cases from DynamoDB and ElasticSearch

# Usage
#   ./clear-env.sh $ENV

./check-env-variables.sh \
  "USTC_ADMIN_PASS" \
  "AWS_ACCESS_KEY_ID" \
  "AWS_SECRET_ACCESS_KEY" \
  "DEFAULT_ACCOUNT_PASS" \
  "ENV" \
  "DYNAMODB_TABLE_NAME" \
  "ELASTICSEARCH_ENDPOINT" \
  "FILE_NAME" \
  "REGION" \
  "USTC_ADMIN_USER" \
  "DEPLOYING_COLOR"

( ! command -v terraform > /dev/null ) && echo "Terraform was not found on your path. Please install terraform." && exit 1
( ! command -v node > /dev/null ) && echo "node was not found on your path. Please install node." && exit 1
( ! command -v aws > /dev/null ) && echo "aws was not found on your path. Please install aws." && exit 1

./web-api/clear-elasticsearch-index.sh $ENV $ELASTICSEARCH_ENDPOINT
./web-api/setup-elasticsearch-index.sh $ENV

node ./web-api/clear-dynamodb-table.js $DYNAMODB_TABLE_NAME
node shared/admin-tools/user/setup-test-users.js
./scripts/data-import/judge/bulk-import-judge-users.sh
