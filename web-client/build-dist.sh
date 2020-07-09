#!/bin/bash -e
ENV=$1
REGION="us-east-1"
API_URL="https://efcms-api-${ENV}.${EFCMS_DOMAIN}"
WS_URL="wss://efcms-websockets-${ENV}.${EFCMS_DOMAIN}"
COGNITO_REDIRECT_URL="https%3A//ui-${ENV}.${EFCMS_DOMAIN}/log-in"
COGNITO_REDIRECT_URI="https://ui-${ENV}.${EFCMS_DOMAIN}/log-in"

USER_POOL_ID=$(aws cognito-idp list-user-pools --query "UserPools[?Name == 'efcms-${ENV}'].Id | [0]" --max-results 30 --region "${REGION}")
USER_POOL_ID="${USER_POOL_ID%\"}"
USER_POOL_ID="${USER_POOL_ID#\"}"

CLIENT_ID=$(aws cognito-idp list-user-pool-clients --user-pool-id "${USER_POOL_ID}" --query "UserPoolClients[?ClientName == 'client'].ClientId | [0]" --max-results 30 --region "${REGION}")
CLIENT_ID="${CLIENT_ID%\"}"
CLIENT_ID="${CLIENT_ID#\"}"

COGNITO_LOGIN_URL="https://auth-${ENV}-${COGNITO_SUFFIX}.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${COGNITO_REDIRECT_URL}"
COGNITO_TOKEN_URL="https://auth-${ENV}-${COGNITO_SUFFIX}.auth.us-east-1.amazoncognito.com/oauth2/token"

if [[ -z "${DYNAMSOFT_URL_OVERRIDE}" ]]; then
  SCANNER_RESOURCE_URI="https://dynamsoft-lib-${ENV}.${EFCMS_DOMAIN}/dynamic-web-twain-sdk-14.3.1"
else
  SCANNER_RESOURCE_URI="${DYNAMSOFT_URL_OVERRIDE}/dynamic-web-twain-sdk-14.3.1"
fi

CIRCLE_SHA1="${CIRCLE_SHA1}" SESSION_TIMEOUT=3300000 COGNITO_CLIENT_ID="${CLIENT_ID}" SCANNER_RESOURCE_URI="${SCANNER_RESOURCE_URI}" COGNITO_TOKEN_URL="${COGNITO_TOKEN_URL}" COGNITO_REDIRECT_URI="${COGNITO_REDIRECT_URI}" WS_URL="${WS_URL}" API_URL="${API_URL}" COGNITO_LOGIN_URL="${COGNITO_LOGIN_URL}" CIRCLE_HONEYBADGER_API_KEY="${CIRCLE_HONEYBADGER_API_KEY}" npm run build:client
