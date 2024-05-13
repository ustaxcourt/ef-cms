#!/bin/bash -e

# Removes the node version records in the target environment's deploy table

# Usage
#   ENV=dev ./remove-node-version-records.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

aws dynamodb delete-item \
  --region us-east-1 \
  --table-name "efcms-deploy-${ENV}" \
  --key '{"pk":{"S":"current-node-version"},"sk":{"S":"current-node-version"}}'

aws dynamodb delete-item \
  --region us-east-1 \
  --table-name "efcms-deploy-${ENV}" \
  --key '{"pk":{"S":"deploying-node-version"},"sk":{"S":"deploying-node-version"}}'