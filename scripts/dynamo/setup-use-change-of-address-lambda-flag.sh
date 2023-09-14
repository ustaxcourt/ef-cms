#!/bin/bash -e

# Sets the redaction acknowledgement enabled feature flag to "false" in the dynamo deploy table

# Usage
#   ENV=dev ./setup-redaction-acknowledgement-enabled-flag.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"use-change-of-address-lambda"},"sk":{"S":"use-change-of-address-lambda"},"current":{"BOOL":true}}'
