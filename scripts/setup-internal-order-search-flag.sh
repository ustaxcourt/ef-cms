#!/bin/bash

# Sets the internal order search enabled flag to "true" in the dynamo deploy table

# Usage
#   ENV=dev ./setup-internal-order-search-flag.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"internal-order-search-enabled "},"sk":{"S":"internal-order-search-enabled "},"current":{"BOOL":true}}'

