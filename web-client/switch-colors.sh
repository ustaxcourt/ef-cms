#!/bin/bash

[ -z "${ENV}" ] && echo "You must have ENV set in your environment" && exit 1
[ -z "${EFCMS_DOMAIN}" ] && echo "You must have EFCMS_DOMAIN set in your environment" && exit 1
[ -z "${ZONE_NAME}" ] && echo "You must have ZONE_NAME set in your environment" && exit 1
[ -z "${DEPLOYING_COLOR}" ] && echo "You must have DEPLOYING_COLOR set in your environment" && exit 1
[ -z "${CURRENT_COLOR}" ] && echo "You must have CURRENT_COLOR set in your environment" && exit 1

node ./web-client/switch-public-ui-colors.js
node ./web-client/switch-ui-colors.js

aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"current-color"},"sk":{"S":"current-color"},"current":{"S":"'$DEPLOYING_COLOR'"}}'

aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"migrate"},"sk":{"S":"migrate"},"current":{"S":"false"}}'

DESTINATION_TABLE_VERSION=$(aws dynamodb get-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --key '{"pk":{"S":"destination-table-version"},"sk":{"S":"destination-table-version"}}' | jq -r ".Item.current.S")
aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"source-table-version"},"sk":{"S":"source-table-version"},"current":{"S":"'$DESTINATION_TABLE_VERSION'"}}'
