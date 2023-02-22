#!/bin/bash -e

# Deletes the e consent fields enabled feature flag

# Usage
#   ENV=dev ./delete-e-consent-fields-enabled-feature-flag.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

aws dynamodb delete-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --key '{"pk":{"S":"e-consent-fields-enabled-feature-flag"},"sk":{"S":"e-consent-fields-enabled-feature-flag"}}'
