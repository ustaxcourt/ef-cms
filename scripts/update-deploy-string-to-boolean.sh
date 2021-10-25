#!/bin/bash

# Updates items in the efcms-deploy-<ENV> table that are really boolean values
# stored as type String to be stored as type Boolean

# Usage
#   ./update-deploy-strings-to-boolean.sh dev

# Arguments
#   - $1 - the environment to update

[ -z "$1" ] && echo "The environment must be provided as the \$1 argument." && exit 1

ENV=$1

DEPLOY_TABLE_NAME="efcms-deploy-${ENV}"

CURRENT_PENDING_COLOR_SWITCH_VALUE=$(aws dynamodb get-item --region us-east-1 --table-name ${DEPLOY_TABLE_NAME} --key '{"pk":{"S":"pending-color-switch"},"sk":{"S":"pending-color-switch"}}' | jq -r ".Item.current.S")
aws dynamodb put-item --region us-east-1 --table-name ${DEPLOY_TABLE_NAME} --item '{"pk":{"S":"pending-color-switch"},"sk":{"S":"pending-color-switch"},"current":{"BOOL": '${CURRENT_PENDING_COLOR_SWITCH_VALUE}'}}'

CURRENT_ORDER_SEARCH_ENABLED_VALUE=$(aws dynamodb get-item --region us-east-1 --table-name ${DEPLOY_TABLE_NAME} --key '{"pk":{"S":"order-search-enabled"},"sk":{"S":"order-search-enabled"}}' | jq -r ".Item.current.S")
aws dynamodb put-item --region us-east-1 --table-name ${DEPLOY_TABLE_NAME} --item '{"pk":{"S":"order-search-enabled"},"sk":{"S":"order-search-enabled"},"current":{"BOOL": '${CURRENT_ORDER_SEARCH_ENABLED_VALUE}'}}'

CURRENT_MIGRATE_VALUE=$(aws dynamodb get-item --region us-east-1 --table-name ${DEPLOY_TABLE_NAME} --key '{"pk":{"S":"migrate"},"sk":{"S":"migrate"}}' | jq -r ".Item.current.S")
aws dynamodb put-item --region us-east-1 --table-name ${DEPLOY_TABLE_NAME} --item '{"pk":{"S":"migrate"},"sk":{"S":"migrate"},"current":{"BOOL": '${CURRENT_MIGRATE_VALUE}'}}'