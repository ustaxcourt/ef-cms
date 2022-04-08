#!/bin/bash

MIGRATE_FLAG=$(./scripts/dynamo/get-migrate-flag.sh "${ENV}")
if [[ "${MIGRATE_FLAG}" == "true" ]]; then
  exit 0
fi

SOURCE_TABLE_VERSION=$(aws dynamodb get-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --key '{"pk":{"S":"source-table-version"},"sk":{"S":"source-table-version"}}' | jq -r ".Item.current.S")

aws es describe-elasticsearch-domain --domain-name "efcms-search-${ENV}-${SOURCE_TABLE_VERSION}" --region us-east-1
CODE=$?
if [[ "${CODE}" != "0" ]]; then
  echo "Setting reindex flag because efcms-search-${ENV}-${SOURCE_TABLE_VERSION} does not exist."
  aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"reindex"},"sk":{"S":"reindex"},"current":{"BOOL":true}}'
fi
