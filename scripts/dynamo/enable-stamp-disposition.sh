#!/bin/bash -e

# Sets the stamp disposition enabled flag to "true" in the dynamo deploy table

# Usage
#   ENV=dev ./enable-stamp-disposition.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"stamp-disposition-enabled"},"sk":{"S":"stamp-disposition-enabled"},"current":{"BOOL":true}}'
