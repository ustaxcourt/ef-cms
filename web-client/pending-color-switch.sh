#!/bin/bash

( ! command -v jq > /dev/null ) && echo "jq must be installed on your machine." && exit 1
[ -z "${ENV}" ] && echo "You must have ENV set in your environment" && exit 1


# disabling aws pager https://github.com/aws/aws-cli/pull/4702#issue-344978525
AWS_PAGER=""

aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"pending-color-switch"},"sk":{"S":"pending-color-switch"},"current":{"BOOL":true}}'
