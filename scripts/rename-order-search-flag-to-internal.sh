#!/bin/bash

# Rename order-search-enabled flag to internal-order-search-enabled

# Usage
#   ENV=dev ./rename-order-search-flag-to-internal.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

CURRENT_INTERNAL_ORDER_SEARCH_VALUE=$(aws dynamodb get-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --key '{"pk":{"S":"order-search-enabled"},"sk":{"S":"order-search-enabled"}}' | jq -r ".Item.current.BOOL")

if [ ! -z "${CURRENT_INTERNAL_ORDER_SEARCH_VALUE}" ]; then
  echo "deleting old order-search-enabled flag"
  aws dynamodb delete-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --key '{"pk":{"S":"order-search-enabled"},"sk":{"S":"order-search-enabled"}}'
  aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"internal-order-search-enabled"},"sk":{"S":"internal-order-search-enabled"},"current":{"BOOL": '${CURRENT_INTERNAL_ORDER_SEARCH_VALUE}'}}'
fi

