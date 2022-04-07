#!/bin/bash -e

# Sets up the s3 deploy bucket with blue and green files for each API

# Usage
#   ./setup-s3-deploy-files.sh

./check-env-variables.sh \
  "ENV" \
  "EFCMS_DOMAIN" \
  "AWS_ACCOUNT_ID" \
  "AWS_ACCESS_KEY_ID" \
  "AWS_SECRET_ACCESS_KEY"

BUCKET_NAME="${EFCMS_DOMAIN}.efcms.${ENV}.us-east-1.lambdas"

aws s3 cp "s3://${BUCKET_NAME}/api_blue.js.zip" "s3://${BUCKET_NAME}/api_green.js.zip"
aws s3 cp "s3://${BUCKET_NAME}/api_public_blue.js.zip" "s3://${BUCKET_NAME}/api_public_green.js.zip"
aws s3 cp "s3://${BUCKET_NAME}/websockets_blue.js.zip" "s3://${BUCKET_NAME}/websockets_green.js.zip"
aws s3 cp "s3://${BUCKET_NAME}/blue_puppeteer_lambda_layer.zip" "s3://${BUCKET_NAME}/green_puppeteer_lambda_layer.zip"

# streams & cron are ONLY on east
aws s3 cp "s3://${BUCKET_NAME}/cron_blue.js.zip" "s3://${BUCKET_NAME}/cron_green.js.zip"
aws s3 cp "s3://${BUCKET_NAME}/streams_blue.js.zip" "s3://${BUCKET_NAME}/streams_green.js.zip"
aws s3 cp "s3://${BUCKET_NAME}/triggers_blue.js.zip" "s3://${BUCKET_NAME}/triggers_green.js.zip"

BUCKET_NAME="${EFCMS_DOMAIN}.efcms.${ENV}.us-west-1.lambdas"

aws s3 cp "s3://${BUCKET_NAME}/api_blue.js.zip" "s3://${BUCKET_NAME}/api_green.js.zip"
aws s3 cp "s3://${BUCKET_NAME}/api_public_blue.js.zip" "s3://${BUCKET_NAME}/api_public_green.js.zip"
aws s3 cp "s3://${BUCKET_NAME}/websockets_blue.js.zip" "s3://${BUCKET_NAME}/websockets_green.js.zip"
aws s3 cp "s3://${BUCKET_NAME}/blue_puppeteer_lambda_layer.zip" "s3://${BUCKET_NAME}/green_puppeteer_lambda_layer.zip"
