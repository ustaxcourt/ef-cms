#!/bin/bash -e
./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID" 
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  echo "Aborted rotate-default-account-password.sh"
  exit $EXIT_CODE
fi

NEW_PASSWORD=$1
if [ -z "${NEW_PASSWORD}" ]
then
      echo "You must provide a new password when calling this script"
      exit 1
fi

REGION=us-east-1

# get current secrets
content=$(aws secretsmanager get-secret-value --region "${REGION}" --secret-id "${ENV}_deploy" --query "SecretString" --output text)
old_pasword=$(echo $content | jq -r '.DEFAULT_ACCOUNT_PASS')
new_secret="${content/"${old_pasword}"/${NEW_PASSWORD}}"

# update secrets
aws secretsmanager put-secret-value \
  --region "${REGION}" \
  --secret-id "${ENV}_deploy" \
  --secret-string "$new_secret"

source ./shared/admin-tools/user/setup-test-users.sh $ENV

echo "✅ DEFAULT_ACCOUNT_PASSWORD updated for $ENV."
