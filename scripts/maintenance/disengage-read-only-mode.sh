#!/bin/bash -e

# Disengages Read-Only Mode for the currently active color in the specified ENV.
#
# What this does:
# - Detects the current color via ./scripts/ssm/get-current-color.sh
# - Reads READ_ONLY_MODE on these lambdas: api_${ENV}_${CURRENT_COLOR}, api_async_${ENV}_${CURRENT_COLOR}, api_public_${ENV}_${CURRENT_COLOR}
# - Sets READ_ONLY_MODE=false on all three
# - If any value changed, invokes ./scripts/maintenance/set-read-only-mode.ts false to send notifications
# - If READ_ONLY_MODE is already false on all three, notifications are skipped
#
# Prerequisites:
# - AWS CLI authenticated with permissions to read/update Lambda configuration
# - Environment variables set: ENV, AWS_ACCOUNT_ID, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
# - Region assumed: us-east-1
#
# Usage examples:
#   ENV=dev AWS_ACCOUNT_ID=123456789012 AWS_ACCESS_KEY_ID=... AWS_SECRET_ACCESS_KEY=... \
#     ./scripts/disengage-read-only-mode.sh
#   npm run read-only:disengage

./check-env-variables.sh \
  "ENV" \
  "AWS_ACCOUNT_ID" \
  "AWS_ACCESS_KEY_ID" \
  "AWS_SECRET_ACCESS_KEY"

CURRENT_COLOR=$(./scripts/ssm/get-current-color.sh "$ENV")

DESIRED_VALUE=false

get_lambda_mm_value() {
  local fn_name="$1"
  aws lambda get-function-configuration \
    --function-name "$fn_name" \
    --region us-east-1 \
    --query 'Environment.Variables.READ_ONLY_MODE' \
    --output text 2>/dev/null || echo "None"
}

API_FN="api_${ENV}_${CURRENT_COLOR}"
ASYNC_FN="api_async_${ENV}_${CURRENT_COLOR}"
PUBLIC_FN="api_public_${ENV}_${CURRENT_COLOR}"

API_CURR=$(get_lambda_mm_value "$API_FN")
ASYNC_CURR=$(get_lambda_mm_value "$ASYNC_FN")
PUBLIC_CURR=$(get_lambda_mm_value "$PUBLIC_FN")

NEEDS_NOTIFY=false
for v in "$API_CURR" "$ASYNC_CURR" "$PUBLIC_CURR"; do
  # Normalize empty/None to false
  if [ "$v" = "None" ] || [ "$v" = "null" ] || [ -z "$v" ]; then
    v="false"
  fi
  if [ "$v" != "$DESIRED_VALUE" ]; then
    NEEDS_NOTIFY=true
    break
  fi
done

web-api/terraform/bin/edit-lambda-environment.sh -l "$API_FN" -k READ_ONLY_MODE -v "$DESIRED_VALUE"
web-api/terraform/bin/edit-lambda-environment.sh -l "$ASYNC_FN" -k READ_ONLY_MODE -v "$DESIRED_VALUE"
web-api/terraform/bin/edit-lambda-environment.sh -l "$PUBLIC_FN" -k READ_ONLY_MODE -v "$DESIRED_VALUE"

if [ "$NEEDS_NOTIFY" = true ]; then
  ./scripts/maintenance/set-read-only-mode.ts false || echo "Warning: Failed to execute set-read-only-mode. If the lambda hasn't been deployed yet, this will fail safely."
else
  echo "READ_ONLY_MODE already set to false on all lambdas; skipping notifications."
fi
