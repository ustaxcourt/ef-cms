#!/bin/bash -e
./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "COGNITO_USER_POOL" \
  "AWS_ACCESS_KEY_ID" \
  "USTC_ADMIN_USER"
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  echo "Aborted load-environment-from-secrets.sh"
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
old_pasword=$(echo $content | jq -r '.USTC_ADMIN_PASS')

# update password for ustc user
aws cognito-idp admin-set-user-password \
  --user-pool-id $COGNITO_USER_POOL \
  --username $USTC_ADMIN_USER \
  --password $NEW_PASSWORD \
  --permanent 

new_secret="${content/"${old_pasword}"/${NEW_PASSWORD}}"

# update secrets
aws secretsmanager put-secret-value \
  --region "${REGION}" \
  --secret-id "${ENV}_deploy" \
  --secret-string "$new_secret"

echo "✅ USTC_ADMIN_USER password updated for $ENV"
