#!/bin/bash -e

# Sets up the s3 deploy bucket with blue and green files for the bounce handler

# Usage
#   ./setup-bounce-handler-deploy-file.sh

./check-env-variables.sh \
  "ENV" \
  "EFCMS_DOMAIN" \
  "AWS_ACCOUNT_ID" \
  "AWS_ACCESS_KEY_ID" \
  "AWS_SECRET_ACCESS_KEY"

BUCKET_NAME="${EFCMS_DOMAIN}.efcms.${ENV}.us-east-1.lambdas"

DEPLOYING_COLOR=$(./scripts/dynamo/get-deploying-color.sh "${ENV}")
CURRENT_COLOR=$(./scripts/dynamo/get-current-color.sh "${ENV}")

aws s3 cp "s3://${BUCKET_NAME}/bounce_handler_${DEPLOYING_COLOR}.js.zip" "s3://${BUCKET_NAME}/bounce_handler_${CURRENT_COLOR}.js.zip"
