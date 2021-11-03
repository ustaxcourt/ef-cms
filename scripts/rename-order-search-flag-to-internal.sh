#!/bin/bash

# Rename order-search-enabled flag to internal-order-search-enabled

# Usage
#   ./rename-order-search-flag-to-internal.sh dev

# Arguments
#   - $1 - the environment to set the flag

[ -z "$1" ] && echo "The environment must be provided as the \$1 argument." && exit 1

ENV=$1

CURRENT_INTERNAL_ORDER_SEARCH_VALUE=$(aws dynamodb get-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --key '{"pk":{"S":"order-search-enabled"},"sk":{"S":"order-search-enabled"}}' | jq -r ".Item.current.BOOL")

aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"internal-order-search-enabled"},"sk":{"S":"internal-order-search-enabled"},"current":{"BOOL": '${CURRENT_INTERNAL_ORDER_SEARCH_VALUE}'}}'

aws dynamodb delete-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --key '{"pk":{"S":"order-search-enabled"},"sk":{"S":"order-search-enabled"}}'