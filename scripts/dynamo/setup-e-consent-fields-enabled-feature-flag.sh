#!/bin/bash -e

# Sets the e consent fields enabled feature flag to "false" in the dynamo deploy table

# Usage
#   ENV=dev ./setup-e-consent-fields-enabled-feature-flag.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"e-consent-fields-enabled-feature-flag"},"sk":{"S":"e-consent-fields-enabled-feature-flag"},"current":{"BOOL":false}}'
