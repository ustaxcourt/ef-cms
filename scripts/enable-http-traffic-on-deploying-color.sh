#!/bin/bash -e

./check-env-variables.sh \
  "ENV" \
  "AWS_ACCOUNT_ID" \
  "AWS_ACCESS_KEY_ID" \
  "AWS_SECRET_ACCESS_KEY"

DEPLOYING_COLOR=$(./scripts/dynamo/get-deploying-color.sh "$ENV")

web-api/terraform/bin/edit-lambda-environment.sh -l "api_${ENV}_${DEPLOYING_COLOR}" -k DISABLE_HTTP_TRAFFIC -v false
web-api/terraform/bin/edit-lambda-environment.sh -l "api_async_${ENV}_${DEPLOYING_COLOR}" -k DISABLE_HTTP_TRAFFIC -v false
web-api/terraform/bin/edit-lambda-environment.sh -l "api_public_${ENV}_${DEPLOYING_COLOR}" -k DISABLE_HTTP_TRAFFIC -v false
