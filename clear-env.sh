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
  "REGION" \
  "FILE_NAME" \
  "USTC_ADMIN_USER" \
  "DEPLOYING_COLOR"

( ! command -v terraform > /dev/null ) && echo "Terraform was not found on your path. Please install terraform." && exit 1
( ! command -v node > /dev/null ) && echo "node was not found on your path. Please install node." && exit 1
( ! command -v aws > /dev/null ) && echo "aws was not found on your path. Please install aws." && exit 1

echo "clearing elasticsearch"
./web-api/clear-elasticsearch-index.sh $ENV $ELASTICSEARCH_ENDPOINT
echo "setting up elasticsearch"
./web-api/setup-elasticsearch-index.sh $ENV

echo "clearing dynamo"
node ./web-api/clear-dynamodb-table.js $DYNAMODB_TABLE_NAME
echo "setting up test users"
node shared/admin-tools/user/setup-test-users.js
echo "importing judge users"
./scripts/data-import/judge/bulk-import-judge-users.sh
