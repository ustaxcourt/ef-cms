#!/bin/bash

# Deletes the consolidated case docket entry duplication enabled feature flag
# Usage
#   ENV=dev ./scripts/dynamo/delete-consolidated-cases-propagate-docket-entries.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

aws dynamodb delete-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --key '"S":"consolidated-cases-propagate-docket-entries"'
