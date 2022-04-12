#!/bin/bash -e

# clears and reinitializes the current active dynamo and elasticsearch instances

# Usage
#   ./clear-env.sh

# shellcheck disable=SC1091
. ./scripts/load-environment-from-secrets.sh

./check-env-variables.sh \
  "USTC_ADMIN_PASS" \
  "AWS_ACCESS_KEY_ID" \
  "AWS_SECRET_ACCESS_KEY" \
  "DEFAULT_ACCOUNT_PASS" \
  "ENV" \
  "USTC_ADMIN_USER" \
  "EFCMS_DOMAIN"

export REGION=us-east-1

( ! command -v terraform > /dev/null ) && echo "Terraform was not found on your path. Please install terraform." && exit 1
( ! command -v node > /dev/null ) && echo "node was not found on your path. Please install node." && exit 1
( ! command -v aws > /dev/null ) && echo "aws was not found on your path. Please install aws." && exit 1

# we use the current-color from dynamo but name the variable DEPLOYING_COLOR since it's needed in the import judge script
DEPLOYING_COLOR=$(aws dynamodb get-item \
  --region us-east-1 \
  --table-name "efcms-deploy-${ENV}" \
  --key '{"pk":{"S":"current-color"},"sk":{"S":"current-color"}}' | jq -r ".Item.current.S")

SOURCE_TABLE_VERSION=$(aws dynamodb get-item \
  --region us-east-1 \
  --table-name "efcms-deploy-${ENV}" \
  --key '{"pk":{"S":"source-table-version"},"sk":{"S":"source-table-version"}}' | jq -r ".Item.current.S")

ELASTICSEARCH_ENDPOINT=$(aws es describe-elasticsearch-domain \
  --domain-name "efcms-search-${ENV}-${SOURCE_TABLE_VERSION}" \
  --region us-east-1 \
  --query 'DomainStatus.Endpoint' \
  --output text)

export SOURCE_TABLE_VERSION
export ELASTICSEARCH_ENDPOINT
export DEPLOYING_COLOR
export FILE_NAME=./scripts/data-import/judge/judge_users.csv

echo "clearing elasticsearch"
./web-api/clear-elasticsearch-index.sh "${ENV}" "${ELASTICSEARCH_ENDPOINT}"
echo "setting up elasticsearch"
./web-api/setup-elasticsearch-index.sh "${ENV}"

echo "clearing dynamo"
node ./web-api/clear-dynamodb-table.js "efcms-${ENV}-${SOURCE_TABLE_VERSION}"
echo "setting up test users"
. ./shared/admin-tools/user/setup-test-users.sh "${ENV}"
echo "importing judge users"
./scripts/data-import/judge/bulk-import-judge-users.sh
