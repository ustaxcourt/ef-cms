#!/bin/bash

# call this script with the --force tag to ready the environment for a blue-green migration

( ! command -v jq > /dev/null ) && echo "jq must be installed on your machine." && exit 1

FORCE_MIGRATION="$1"

set -e
./check-env-variables.sh \
  "ENV" \
  "EFCMS_DOMAIN" \
  "ZONE_NAME" \
  "AWS_ACCOUNT_ID" \
  "AWS_ACCESS_KEY_ID" \
  "AWS_SECRET_ACCESS_KEY"
set +e

# shellcheck disable=SC1091
source ./scripts/helpers/dynamodb-table-exists.sh
# shellcheck disable=SC1091
source ./scripts/helpers/opensearch-domain-exists.sh

node web-api/is-migration-needed.js
SKIP_MIGRATION="$?"

if [[ "$SKIP_MIGRATION" == "1" ]] && [[ "$FORCE_MIGRATION" != "--force" ]]; then
  exit 0
fi

echo "setting migrate flag to true"
aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"migrate"},"sk":{"S":"migrate"},"current":{"BOOL":true}}'

echo "setting migration-queue-empty flag to false"
aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"migration-queue-empty"},"sk":{"S":"migration-queue-empty"},"current":{"BOOL":false}}'

SOURCE_TABLE_VERSION=$(aws dynamodb get-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --key '{"pk":{"S":"source-table-version"},"sk":{"S":"source-table-version"}}' | jq -r ".Item.current.S")
echo "source table is currently ${SOURCE_TABLE_VERSION}"

if [[ "$SOURCE_TABLE_VERSION" == "beta" ]]; then
  echo "setting destination table to alpha"
  NEXT_VERSION="alpha"
  aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"destination-table-version"},"sk":{"S":"destination-table-version"},"current":{"S":"alpha"}}'
else
  echo "setting destination table to beta"
  NEXT_VERSION="beta"
  aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"destination-table-version"},"sk":{"S":"destination-table-version"},"current":{"S":"beta"}}'
fi

NEXT_TABLE="efcms-${ENV}-${NEXT_VERSION}"
NEXT_OPENSEARCH_DOMAIN="efcms-search-${ENV}-${NEXT_VERSION}"

EAST_EXISTS=$(check_dynamo_table_exists "${NEXT_TABLE}" us-east-1)
WEST_EXISTS=$(check_dynamo_table_exists "${NEXT_TABLE}" us-west-1)
if [[ "$EAST_EXISTS" == "1" ]] || [[ "$WEST_EXISTS" == "1" ]]; then
  NUM_EAST_ITEMS=$(aws dynamodb scan --table-name "${NEXT_TABLE}" --region us-east-1 --max-items 1 | jq .Count)
  NUM_WEST_ITEMS=$(aws dynamodb scan --table-name "${NEXT_TABLE}" --region us-west-1 --max-items 1 | jq .Count)
  if [[ "$NUM_EAST_ITEMS" != "0" ]] || [[ "$NUM_WEST_ITEMS" != "0" ]]; then
    ./scripts/dynamo/delete-dynamo-table.sh "$NEXT_TABLE"
  else
    echo "warn: the table ${NEXT_TABLE} exists, but it is empty"
  fi
fi

EXISTS=$(check_opensearch_domain_exists "$NEXT_OPENSEARCH_DOMAIN")
if [[ "$EXISTS" == "1" ]]; then
  npx ts-node --transpile-only ./scripts/elasticsearch/ready-cluster-for-migration.ts "$NEXT_OPENSEARCH_DOMAIN"
  CLUSTER_IS_NOT_EMPTY="$?"
  if [[ "$CLUSTER_IS_NOT_EMPTY" == "1" ]]; then
    aws es delete-elasticsearch-domain --domain-name "$NEXT_OPENSEARCH_DOMAIN" --region us-east-1
    while [[ "$EXISTS" == "1" ]]; do
      echo "${NEXT_OPENSEARCH_DOMAIN} is still being deleted. Waiting 30 seconds then checking again."
      sleep 30
      EXISTS=$(check_opensearch_domain_exists "$NEXT_OPENSEARCH_DOMAIN")
    done
  else
    echo "warn: the opensearch cluster ${NEXT_OPENSEARCH_DOMAIN} exists, but it is empty"
  fi
fi
