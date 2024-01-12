#!/bin/bash -e

./check-env-variables.sh \
  "EFCMS_DOMAIN" \
  "ENV" \
  "DEPLOYING_COLOR" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

REGION="us-east-1"
API_URL="https://public-api-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}"
COGNITO_REDIRECT_URL="https%3A//app.${EFCMS_DOMAIN}/log-in"
PUBLIC_SITE_URL="https://${EFCMS_DOMAIN}"

USER_POOL_ID=$(aws cognito-idp list-user-pools --query "UserPools[?Name == 'efcms-${ENV}'].Id | [0]" --max-results 30 --region "${REGION}" --output text)

CLIENT_ID=$(aws cognito-idp list-user-pool-clients --user-pool-id "${USER_POOL_ID}" --query "UserPoolClients[?ClientName == 'client'].ClientId | [0]" --max-results 30 --region "${REGION}" --output text)

# TODO: remove later?
COGNITO_PASSWORD_RESET_REQUEST_URL="https://auth-${ENV}-${COGNITO_SUFFIX}.auth.us-east-1.amazoncognito.com/forgotPassword?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${COGNITO_REDIRECT_URL}"

STAGE="${CLIENT_STAGE}" \
  COGNITO_LOGIN_URL="${COGNITO_LOGIN_URL}" \
  COGNITO_PASSWORD_RESET_REQUEST_URL="${COGNITO_PASSWORD_RESET_REQUEST_URL}" \
  COGNITO_CLIENT_ID="${CLIENT_ID}" \
  CIRCLE_SHA1="${CIRCLE_SHA1}" \
  EFCMS_DOMAIN="${EFCMS_DOMAIN}" \
  SESSION_TIMEOUT=3300000 \
  API_URL="${API_URL}" \
  PDF_EXPRESS_LICENSE_KEY="${PDF_EXPRESS_LICENSE_KEY}" \
  PUBLIC_SITE_URL="${PUBLIC_SITE_URL}" \
  CI="" \
  npm run build:public
