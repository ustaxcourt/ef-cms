#!/bin/bash -e

ENV=$1
DEPLOYING_COLOR=$2

[ -z "${EFCMS_DOMAIN}" ] && echo "You must have EFCMS_DOMAIN set in your environment" && exit 1
[ -z "${ENV}" ] && echo 'You must pass ENV as argument $1' && exit 1
[ -z "${DEPLOYING_COLOR}" ] && echo 'You must pass DEPLOYING_COLOR as argument $2' && exit 1

REGION="us-east-1"
API_URL="https://public-api-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}"
COGNITO_REDIRECT_URL="https%3A//app.${EFCMS_DOMAIN}/log-in"
PUBLIC_SITE_URL="https://${EFCMS_DOMAIN}"

USER_POOL_ID=$(aws cognito-idp list-user-pools --query "UserPools[?Name == 'efcms-${ENV}'].Id | [0]" --max-results 30 --region "${REGION}" --output text)

CLIENT_ID=$(aws cognito-idp list-user-pool-clients --user-pool-id "${USER_POOL_ID}" --query "UserPoolClients[?ClientName == 'client'].ClientId | [0]" --max-results 30 --region "${REGION}" --output text)

COGNITO_LOGIN_URL="https://auth-${ENV}-${COGNITO_SUFFIX}.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${COGNITO_REDIRECT_URL}"

STAGE="${CLIENT_STAGE}" COGNITO_LOGIN_URL="${COGNITO_LOGIN_URL}" CIRCLE_SHA1="${CIRCLE_SHA1}" SESSION_TIMEOUT=3300000 API_URL="${API_URL}" PUBLIC_SITE_URL="${PUBLIC_SITE_URL}" npm run build:public
