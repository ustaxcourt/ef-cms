#!/usr/bin/env bash
set -e

./check-env-variables.sh \
  "ENV" \
  "AWS_ACCOUNT_ID" \
  "AWS_ACCESS_KEY_ID" \
  "AWS_SECRET_ACCESS_KEY"

CURRENT_COLOR=$(./scripts/ssm/get-current-color.sh "$ENV")

web-api/terraform/bin/edit-lambda-environment.sh -l "api_${ENV}_${CURRENT_COLOR}" -k MAINTENANCE_MODE -v true
web-api/terraform/bin/edit-lambda-environment.sh -l "api_async_${ENV}_${CURRENT_COLOR}" -k MAINTENANCE_MODE -v true
web-api/terraform/bin/edit-lambda-environment.sh -l "api_public_${ENV}_${CURRENT_COLOR}" -k MAINTENANCE_MODE -v true
