#!/bin/bash -e

./check-env-variables.sh "ENV"

# disabling aws pager https://github.com/aws/aws-cli/pull/4702#issue-344978525
AWS_PAGER=""
export AWS_PAGER

aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"pending-color-switch"},"sk":{"S":"pending-color-switch"},"current":{"BOOL":true}}'
