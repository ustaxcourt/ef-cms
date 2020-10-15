#!/bin/bash

# Returns a petitionsclerk JWT token that is used for smoketests

# Usage
#   ./set-tokens.sh

# Requirements
#   - aws cli must be installed on your machine
#   - aws credentials must be installed on your machine

[ -z "${DEFAULT_ACCOUNT_PASS}" ] && echo "You must have DEFAULT_ACCOUNT_PASS set in your environment" && exit 1

REGION="us-east-1"

USER_POOL_ID=$(aws cognito-idp list-user-pools --query "UserPools[?Name == 'efcms-${ENV}'].Id | [0]" --max-results 30 --region "${REGION}" --output text)

CLIENT_ID=$(aws cognito-idp list-user-pool-clients --user-pool-id "${USER_POOL_ID}" --query "UserPoolClients[?ClientName == 'client'].ClientId | [0]" --max-results 30 --region "${REGION}" --output text)

response=$(aws cognito-idp admin-initiate-auth \
    --user-pool-id "${USER_POOL_ID}" \
    --client-id "${CLIENT_ID}" \
    --region "${REGION}" \
    --auth-flow ADMIN_NO_SRP_AUTH \
    --auth-parameters USERNAME="petitionsclerk1@example.com"',PASSWORD'="${DEFAULT_ACCOUNT_PASS}")

PETITIONS_CLERK_TOKEN=$(echo $response | jq -r '.AuthenticationResult.IdToken')

export PETITIONS_CLERK_TOKEN
