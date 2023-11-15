#!/bin/bash -e

# Returns a petitionsclerk JWT token that is used for smoketests

# Usage
#   ./set-tokens.sh

( ! command -v jq > /dev/null ) && echo "jq must be installed on your machine." && exit 1
( ! command -v aws > /dev/null ) && echo "aws must be installed on your machine." && exit 1

./check-env-variables.sh \
  "ENV" \
  "DEFAULT_ACCOUNT_PASS" \
  "AWS_ACCOUNT_ID" \
  "AWS_ACCESS_KEY_ID" \
  "AWS_SECRET_ACCESS_KEY"

REGION="us-east-1"

USER_POOL_ID=$(aws cognito-idp list-user-pools --query "UserPools[?Name == 'efcms-${ENV}'].Id | [0]" --max-results 30 --region "${REGION}" --output text)

CLIENT_ID=$(aws cognito-idp list-user-pool-clients --user-pool-id "${USER_POOL_ID}" --query "UserPoolClients[?ClientName == 'client'].ClientId | [0]" --max-results 30 --region "${REGION}" --output text)

# suppressing error output from cognito to avoid exposing unparsable passwords

response=$(aws cognito-idp admin-initiate-auth \
    --user-pool-id "${USER_POOL_ID}" \
    --client-id "${CLIENT_ID}" \
    --region "${REGION}" \
    --auth-flow ADMIN_NO_SRP_AUTH \
    --auth-parameters USERNAME="petitionsclerk1@example.com"',PASSWORD'="${DEFAULT_ACCOUNT_PASS}" 2>/dev/null)
exitcode=$?

if [ $exitcode -eq 0 ]; then
          PETITIONS_CLERK_TOKEN=$(echo "${response}" | jq -r '.AuthenticationResult.IdToken')
    export PETITIONS_CLERK_TOKEN

else
    echo "Error: cognito-idp admin-initiate-auth failed; unable to set PETITIONS_CLERK_TOKEN"
fi
