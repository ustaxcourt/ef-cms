#!/bin/bash -e

# Disengages Read-Only Mode for the currently active color in the specified ENV.
#
# What this does:
# - Reads READ_ONLY_MODE on the API lambdas: api_${ENV}_${CURRENT_COLOR}, api_async_${ENV}_${CURRENT_COLOR}, api_public_${ENV}_${CURRENT_COLOR}
# - Sets READ_ONLY_MODE=false on ALL lambdas matching *_${ENV}_${CURRENT_COLOR}
# - If any value changed, invokes ./scripts/maintenance/set-read-only-mode.ts false to send notifications
# - If READ_ONLY_MODE is already false on all three API lambdas, notifications are skipped
#
# Prerequisites:
# - AWS CLI authenticated with permissions to read/update Lambda configuration
# - Environment variables set: ENV, CURRENT_COLOR, REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
#
# Usage examples:
#   ENV=dev CURRENT_COLOR=blue REGION=us-east-1 AWS_ACCESS_KEY_ID=... AWS_SECRET_ACCESS_KEY=... \
#     ./scripts/disengage-read-only-mode.sh
#   npm run read-only:disengage

./check-env-variables.sh \
  "ENV" \
  "CURRENT_COLOR" \
  "REGION" \
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

ACTIVE_LAMBDAS=$(aws lambda list-functions \
  --region "$REGION" \
  --output json 2>/dev/null | jq -r '.Functions[]?.FunctionName' | grep ".*_${ENV}_${CURRENT_COLOR}.*" || echo "")

if [ -n "$ACTIVE_LAMBDAS" ]; then
  for LAMBDA_NAME in $ACTIVE_LAMBDAS; do
    echo "Setting READ_ONLY_MODE to ${DESIRED_VALUE} in ${LAMBDA_NAME}"
    web-api/terraform/bin/edit-lambda-environment.sh \
      -l "$LAMBDA_NAME" \
      -k READ_ONLY_MODE \
      -v "$DESIRED_VALUE" \
      -r "$REGION" >/dev/null
  done
else
  echo "No active lambdas found matching _${ENV}_${CURRENT_COLOR}."
fi

if [ "$NEEDS_NOTIFY" = true ]; then
  ./scripts/maintenance/set-read-only-mode.ts false
else
  echo "READ_ONLY_MODE already set to false on all lambdas; skipping notifications."
fi
