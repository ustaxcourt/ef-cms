#!/bin/bash -e

# Removes the redaction acknowledgement enabled feature flag in the dynamo deploy table

# Usage
#   ENV=dev ./remove-redaction-acknowledgement-enabled-flag.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

aws dynamodb delete-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --key '{"pk":{"S":"redaction-acknowledgement-enabled"},"sk":{"S":"redaction-acknowledgement-enabled"}}'
