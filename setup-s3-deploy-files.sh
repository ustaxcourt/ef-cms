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

EAST_BUCKET_NAME="${EFCMS_DOMAIN}.efcms.${ENV}.us-east-1.lambdas"
WEST_BUCKET_NAME="${EFCMS_DOMAIN}.efcms.${ENV}.us-west-1.lambdas"

DEPLOYING_COLOR=$(./scripts/dynamo/get-deploying-color.sh "${ENV}")
CURRENT_COLOR=$(./scripts/dynamo/get-current-color.sh "${ENV}")

aws s3 cp "s3://${EAST_BUCKET_NAME}/api_${DEPLOYING_COLOR}.js.zip" "s3://${EAST_BUCKET_NAME}/api_${CURRENT_COLOR}.js.zip"
aws s3 cp "s3://${EAST_BUCKET_NAME}/api_public_${DEPLOYING_COLOR}.js.zip" "s3://${EAST_BUCKET_NAME}/api_public_${CURRENT_COLOR}.js.zip"
aws s3 cp "s3://${EAST_BUCKET_NAME}/websockets_${DEPLOYING_COLOR}.js.zip" "s3://${EAST_BUCKET_NAME}/websockets_${CURRENT_COLOR}.js.zip"
aws s3 cp "s3://${EAST_BUCKET_NAME}/${DEPLOYING_COLOR}_puppeteer_lambda_layer.zip" "s3://${EAST_BUCKET_NAME}/${CURRENT_COLOR}_puppeteer_lambda_layer.zip"

# streams & cron are ONLY on east
aws s3 cp "s3://${EAST_BUCKET_NAME}/cron_${DEPLOYING_COLOR}.js.zip" "s3://${EAST_BUCKET_NAME}/cron_${CURRENT_COLOR}.js.zip"
aws s3 cp "s3://${EAST_BUCKET_NAME}/streams_${DEPLOYING_COLOR}.js.zip" "s3://${EAST_BUCKET_NAME}/streams_${CURRENT_COLOR}.js.zip"
aws s3 cp "s3://${EAST_BUCKET_NAME}/triggers_${DEPLOYING_COLOR}.js.zip" "s3://${EAST_BUCKET_NAME}/triggers_${CURRENT_COLOR}.js.zip"
aws s3 cp "s3://${EAST_BUCKET_NAME}/bounce_handler_${DEPLOYING_COLOR}.js.zip" "s3://${EAST_BUCKET_NAME}/bounce_handler_${CURRENT_COLOR}.js.zip"
aws s3 cp "s3://${EAST_BUCKET_NAME}/seal_in_lower_${DEPLOYING_COLOR}.js.zip" "s3://${EAST_BUCKET_NAME}/seal_in_lower_${CURRENT_COLOR}.js.zip"


aws s3 cp "s3://${WEST_BUCKET_NAME}/api_${DEPLOYING_COLOR}.js.zip" "s3://${WEST_BUCKET_NAME}/api_${CURRENT_COLOR}.js.zip"
aws s3 cp "s3://${WEST_BUCKET_NAME}/api_public_${DEPLOYING_COLOR}.js.zip" "s3://${WEST_BUCKET_NAME}/api_public_${CURRENT_COLOR}.js.zip"
aws s3 cp "s3://${WEST_BUCKET_NAME}/websockets_${DEPLOYING_COLOR}.js.zip" "s3://${WEST_BUCKET_NAME}/websockets_${CURRENT_COLOR}.js.zip"
aws s3 cp "s3://${WEST_BUCKET_NAME}/${DEPLOYING_COLOR}_puppeteer_lambda_layer.zip" "s3://${WEST_BUCKET_NAME}/${CURRENT_COLOR}_puppeteer_lambda_layer.zip"
