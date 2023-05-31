#!/bin/bash

# Sets the external pdf generation flag in the deploy table

# Usage
#   ENV=dev ./setup-external-order-search-flag.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"use-external-pdf-generation"},"sk":{"S":"use-external-pdf-generation"},"current":{"BOOL":true}}'

