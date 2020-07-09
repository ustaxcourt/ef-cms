#!/bin/bash

# Returns a petitionsclerk JWT token that is used for smoketests

# Usage
#   ./set-tokens.sh

# Requirements
#   - aws cli must be installed on your machine
#   - aws credentials must be installed on your machine

REGION="us-east-1"

USER_POOL_ID=$(aws cognito-idp list-user-pools --query "UserPools[?Name == 'efcms-${ENV}'].Id | [0]" --max-results 30 --region "${REGION}")
USER_POOL_ID="${USER_POOL_ID%\"}"
USER_POOL_ID="${USER_POOL_ID#\"}"

CLIENT_ID=$(aws cognito-idp list-user-pool-clients --user-pool-id "${USER_POOL_ID}" --query "UserPoolClients[?ClientName == 'client'].ClientId | [0]" --max-results 30 --region "${REGION}")
CLIENT_ID="${CLIENT_ID%\"}"
CLIENT_ID="${CLIENT_ID#\"}"

response=$(aws cognito-idp admin-initiate-auth \
    --user-pool-id "${USER_POOL_ID}" \
    --client-id "${CLIENT_ID}" \
    --region "${REGION}" \
    --auth-flow ADMIN_NO_SRP_AUTH \
    --auth-parameters USERNAME="petitionsclerk1@example.com"',PASSWORD'="Testing1234$")

PETITIONS_CLERK_TOKEN=$(echo $response | jq -r '.AuthenticationResult.IdToken')

export PETITIONS_CLERK_TOKEN
