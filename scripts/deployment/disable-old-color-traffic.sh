#!/bin/bash

# Parameters:
#   FUNCTION_NAME: The name of the Lambda function you want to update

REGION="us-east-1"
FUNCTION_NAME=$1
ENV_VARS_KEY_VALUE_UPSERT=("MY_TEST_ENV_VAR" "test")

EXISTING_ENV_VARS=$(aws lambda get-function-configuration \
    --function-name "$FUNCTION_NAME" \
    --region "$REGION" \
    --query 'Environment.Variables' \
    --output json)

echo "$EXISTING_ENV_VARS"

# Update or insert new environment variables
UPDATED_ENV_VARS="$EXISTING_ENV_VARS"
for ((i = 0; i < ${#ENV_VARS_KEY_VALUE_UPSERT[@]}; i+=2)); do
  UPDATED_ENV_VARS=$(echo "$UPDATED_ENV_VARS" \
      | jq --arg key "${ENV_VARS_KEY_VALUE_UPSERT[$i]}" --arg value "${ENV_VARS_KEY_VALUE_UPSERT[$i + 1]}" \
      '.[$key] = $value')
done

echo "$UPDATED_ENV_VARS"

# Update the Lambda function configuration with the new environment variables
# aws lambda update-function-configuration \
#     --function-name "$FUNCTION_NAME" \
#     --environment "{\"Variables\": $UPDATED_ENV_VARS}" \
#     --region "$REGION"
