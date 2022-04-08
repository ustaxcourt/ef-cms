#!/bin/bash -e

# Sets up the s3 lambda bucket with blue and green files for maintenance-notify code

# Usage
#   ./setup-s3-maintenance-file.sh

./check-env-variables.sh \
  "ENV" \
  "EFCMS_DOMAIN" \
  "AWS_ACCOUNT_ID" \
  "AWS_ACCESS_KEY_ID" \
  "AWS_SECRET_ACCESS_KEY"

BUCKET_NAME_EAST="${EFCMS_DOMAIN}.efcms.${ENV}.us-east-1.lambdas"
BUCKET_NAME_WEST="${EFCMS_DOMAIN}.efcms.${ENV}.us-west-1.lambdas"

DEPLOYING_COLOR=$(./scripts/dynamo/get-deploying-color.sh "${ENV}")
CURRENT_COLOR=$(./scripts/dynamo/get-current-color.sh "${ENV}")

aws s3 cp "s3://${BUCKET_NAME_EAST}/maintenance_notify_${DEPLOYING_COLOR}.js.zip" "s3://${BUCKET_NAME_EAST}/maintenance_notify_${CURRENT_COLOR}.js.zip"
aws s3 cp "s3://${BUCKET_NAME_WEST}/maintenance_notify_${DEPLOYING_COLOR}.js.zip" "s3://${BUCKET_NAME_WEST}/maintenance_notify_${CURRENT_COLOR}.js.zip"
