#!/bin/bash -e
ENV=$1
REGION="us-east-1"

USER_POOL_ID=$(aws cognito-idp list-user-pools --query "UserPools[?Name == 'efcms-${ENV}'].Id | [0]" --max-results 30 --region "${REGION}")
USER_POOL_ID="${USER_POOL_ID%\"}"
USER_POOL_ID="${USER_POOL_ID#\"}"

CLIENT_ID=$(aws cognito-idp list-user-pool-clients --user-pool-id "${USER_POOL_ID}" --query "UserPoolClients[?ClientName == 'client'].ClientId | [0]" --max-results 30 --region "${REGION}")
CLIENT_ID="${CLIENT_ID%\"}"
CLIENT_ID="${CLIENT_ID#\"}"

CSS="$(cat ./cognito/style.css)"
aws cognito-idp set-ui-customization \
  --user-pool-id "${USER_POOL_ID}" \
  --client-id "${CLIENT_ID}" \
  --css "${CSS}" \
  --image-file fileb://./cognito/logo.jpg \
  --region "${REGION}"