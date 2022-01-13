#!/bin/bash -e

# clears and reinitializes the current active dynamo and elasticsearch instances

# Usage
#   ./clear-env.sh $ENV

./check-env-variables.sh \
  "USTC_ADMIN_PASS" \
  "AWS_ACCESS_KEY_ID" \
  "AWS_SECRET_ACCESS_KEY" \
  "DEFAULT_ACCOUNT_PASS" \
  "ENV" \
  "USTC_ADMIN_USER" \
  "DEPLOYING_COLOR"

export REGION=us-east-1

( ! command -v terraform > /dev/null ) && echo "Terraform was not found on your path. Please install terraform." && exit 1
( ! command -v node > /dev/null ) && echo "node was not found on your path. Please install node." && exit 1
( ! command -v aws > /dev/null ) && echo "aws was not found on your path. Please install aws." && exit 1

SOURCE_TABLE_VERSION=$(aws dynamodb get-item \
  --region us-east-1 \
  --table-name "efcms-deploy-${ENV}" \
  --key '{"pk":{"S":"source-table-version"},"sk":{"S":"source-table-version"}}' | jq -r ".Item.current.S")

export ELASTICSEARCH_ENDPOINT=$(aws es describe-elasticsearch-domain \
  --domain-name efcms-search-${ENV}-${SOURCE_TABLE_VERSION} \
  --region us-east-1 \
  --query 'DomainStatus.Endpoint' \
  --output text)

export FILE_NAME=./scripts/data-import/judge/judge_users.csv

echo "clearing elasticsearch"
./web-api/clear-elasticsearch-index.sh "${ENV}" "${ELASTICSEARCH_ENDPOINT}"
echo "setting up elasticsearch"
./web-api/setup-elasticsearch-index.sh "${ENV}"

echo "clearing dynamo"
node ./web-api/clear-dynamodb-table.js "efcms-${ENV}-${SOURCE_TABLE_VERSION}"
echo "setting up test users"
node shared/admin-tools/user/setup-test-users.js
echo "importing judge users"
./scripts/data-import/judge/bulk-import-judge-users.sh
