#!/bin/bash

# Sets the consolidated case docket entry duplication enabled flag to "false" in the dynamo deploy table

# Usage
#   ENV=dev ./scripts/dynamo/setup-consolidated-cases-propagate-docket-entries.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"consolidated-cases-propagate-docket-entries"},"sk":{"S":"consolidated-cases-propagate-docket-entries"},"current":{"BOOL":false}}'
