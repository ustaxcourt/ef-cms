#!/bin/bash -e
ENV=$1
REGION="us-east-1"

USER_POOL_ID=$(aws cognito-idp list-user-pools --query "UserPools[?Name == 'efcms-${ENV}'].Id | [0]" --max-results 30 --region "${REGION}")
USER_POOL_ID="${USER_POOL_ID%\"}"
USER_POOL_ID="${USER_POOL_ID#\"}"

CLIENT_ID=$(aws cognito-idp list-user-pool-clients --user-pool-id "${USER_POOL_ID}" --query "UserPoolClients[?ClientName == 'client'].ClientId | [0]" --max-results 30 --region "${REGION}")
CLIENT_ID="${CLIENT_ID%\"}"
CLIENT_ID="${CLIENT_ID#\"}"

# taxpayer@example.com
aws cognito-idp sign-up \
  --region "${REGION}" \
  --client-id "${CLIENT_ID}" \
  --username taxpayer@example.com \
  --password Testing1234$ || true

aws cognito-idp admin-confirm-sign-up \
  --region "${REGION}" \
  --user-pool-id "${USER_POOL_ID}" \
  --username taxpayer@example.com || true

aws cognito-idp admin-update-user-attributes \
  --region "${REGION}" \
  --user-pool-id "${USER_POOL_ID}" \
  --username taxpayer@example.com \
  --user-attributes Name="custom:role",Value="petitioner" || true