#!/bin/bash

( ! command -v jq > /dev/null ) && echo "jq must be installed on your machine." && exit 1
[ -z "${ENV}" ] && echo "You must have ENV set in your environment" && exit 1
[ -z "${AWS_ACCOUNT_ID}" ] && echo "You must have AWS_ACCOUNT_ID set in your environment" && exit 1
[ -z "${EFCMS_DOMAIN}" ] && echo "You must have EFCMS_DOMAIN set in your environment" && exit 1
[ -z "${ZONE_NAME}" ] && echo "You must have ZONE_NAME set in your environment" && exit 1

node web-api/is-migration-needed.js
SKIP_MIGRATION="$?"

if [[ "${SKIP_MIGRATION}" == "1" ]]; then
  exit 0
fi

echo "setting migrate flag to true"
aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"migrate"},"sk":{"S":"migrate"},"current":{"BOOL":true}}'

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

aws dynamodb describe-table --table-name "efcms-${ENV}-${NEXT_VERSION}" --region us-east-1
CODE=$?
if [[ "${CODE}" == "0" ]]; then
  echo "error: expected the efcms-${ENV}-${NEXT_VERSION} table to have been deleted from us-east-1 before running migration"
  exit 1
fi

aws dynamodb describe-table --table-name "efcms-${ENV}-${NEXT_VERSION}" --region us-west-1
CODE=$?
if [[ "${CODE}" == "0" ]]; then
  echo "error: expected the efcms-${ENV}-${NEXT_VERSION} table to have been deleted from us-west-1 before running migration"
  exit 1
fi

aws es describe-elasticsearch-domain --domain-name "efcms-search-${ENV}-${NEXT_VERSION}" --region us-east-1
CODE=$?
if [[ "${CODE}" == "0" ]]; then
  echo "error: expected the efcms-search-${ENV}-${NEXT_VERSION} elasticsearch cluster to have been deleted from us-east-1 before running migration"
  exit 1
fi