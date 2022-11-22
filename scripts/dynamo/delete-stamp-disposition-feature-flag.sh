#!/bin/bash -e

# Deletes the stamp disposition feature flag

# Usage
#   ENV=dev ./delete-stamp-disposition-feature-flag.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

aws dynamodb delete-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --key '{"pk":{"S":"stamp-disposition-enabled"},"sk":{"S":"stamp-disposition-enabled"}}'
