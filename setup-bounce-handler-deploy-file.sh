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

aws s3 cp "s3://${BUCKET_NAME}/bounce_handler_blue.js.zip" "s3://${BUCKET_NAME}/bounce_handler_green.js.zip"
