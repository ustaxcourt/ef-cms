#!/bin/bash -e
ENV=$1
REGION="us-east-1"
API_URL="https://efcms-public-api-${ENV}.${EFCMS_DOMAIN}"
COGNITO_REDIRECT_URL="https%3A//ui-${ENV}.${EFCMS_DOMAIN}/log-in"

USER_POOL_ID=$(aws cognito-idp list-user-pools --query "UserPools[?Name == 'efcms-${ENV}'].Id | [0]" --max-results 30 --region "${REGION}")
USER_POOL_ID="${USER_POOL_ID%\"}"
USER_POOL_ID="${USER_POOL_ID#\"}"

CLIENT_ID=$(aws cognito-idp list-user-pool-clients --user-pool-id "${USER_POOL_ID}" --query "UserPoolClients[?ClientName == 'client'].ClientId | [0]" --max-results 30 --region "${REGION}")
CLIENT_ID="${CLIENT_ID%\"}"
CLIENT_ID="${CLIENT_ID#\"}"

COGNITO_LOGIN_URL="https://auth-${ENV}-${COGNITO_SUFFIX}.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${COGNITO_REDIRECT_URL}"

COGNITO_LOGIN_URL="${COGNITO_LOGIN_URL}" CIRCLE_SHA1="${CIRCLE_SHA1}" SESSION_TIMEOUT=3300000 API_URL="${API_URL}" npm run build:public
