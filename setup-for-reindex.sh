#!/bin/bash

MIGRATE_FLAG=$(../../../scripts/dynamo/get-migrate-flag.sh ${ENV})
if [[ "${MIGRATE_FLAG}" == "true" ]]; then
  exit 0
fi

SOURCE_TABLE_VERSION=$(aws dynamodb get-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --key '{"pk":{"S":"source-table-version"},"sk":{"S":"source-table-version"}}' | jq -r ".Item.current.S")
echo "source table is currently ${SOURCE_TABLE_VERSION}"

if [[ "${SOURCE_TABLE_VERSION}" == "beta" ]]; then
  echo "setting destination table to alpha"
  NEXT_VERSION="alpha"
  aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"destination-table-version"},"sk":{"S":"destination-table-version"},"current":{"S":"alpha"}}'
else
  echo "setting destination table to beta"
  NEXT_VERSION="beta"
  aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"destination-table-version"},"sk":{"S":"destination-table-version"},"current":{"S":"beta"}}'
fi

aws es describe-elasticsearch-domain --domain-name "efcms-search-${ENV}-${NEXT_VERSION}" --region us-east-1
CODE=$?
if [[ "${CODE}" != "0" ]]; then
  echo "ES describe exit code was ${CODE}."
  export REINDEX_FLAG=true
fi
