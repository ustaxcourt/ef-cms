#!/bin/bash

[ -z "${ENV}" ] && echo "You must have ENV set in your environment" && exit 1
[ -z "${DESTINATION_TABLE_VERSION}" ] && echo "You must have DESTINATION_TABLE_VERSION set in your environment" && exit 1

config=$(aws lambda get-function-configuration --function-name "cognito_post_confirmation_lambda_${ENV}" --region "us-east-1" | jq ".Environment")
replace=$(echo $config | sed -E "s/efcms-${ENV}-[a-z]+/efcms-${ENV}-${DESTINATION_TABLE_VERSION}/g")
aws lambda update-function-configuration --function-name "cognito_post_confirmation_lambda_${ENV}" --region "us-east-1" --environment "${replace}" --output=text
