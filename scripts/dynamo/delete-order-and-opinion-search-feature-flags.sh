#!/bin/bash

# Deletes the external and internal advanced search (order and opinion) flags in the dynamo deploy table

# Usage
#   ENV=exp1 ./delete-order-and-opinion-search-feature-flags.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

aws dynamodb delete-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --key '{"pk":{"S":"external-opinion-search-enabled"},"sk":{"S":"external-opinion-search-enabled"}}'
aws dynamodb delete-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --key '{"pk":{"S":"external-order-search-enabled"},"sk":{"S":"external-order-search-enabled"}}'
aws dynamodb delete-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --key '{"pk":{"S":"internal-opinion-search-enabled"},"sk":{"S":"internal-opinion-search-enabled"}}'
aws dynamodb delete-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --key '{"pk":{"S":"internal-order-search-enabled"},"sk":{"S":"internal-order-search-enabled"}}'

