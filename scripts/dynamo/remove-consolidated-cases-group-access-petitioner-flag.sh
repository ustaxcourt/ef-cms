#!/bin/bash

# Removes the feature flag for multi-docketable paper filings (#9493).

# Usage
#   ENV=dev ./remove-multi-docketable-paper-filings-feature-flag.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

aws dynamodb delete-item \
    --region us-east-1 \
    --table-name "efcms-deploy-${ENV}" \
    --key '{"pk":{"S":"consolidated-cases-group-access-petitioner"},"sk":{"S":"consolidated-cases-group-access-petitioner"}}'
