#!/bin/bash -e

ENV=$1
DEPLOYING_COLOR=$2

[ -z "${EFCMS_DOMAIN}" ] && echo "You must have EFCMS_DOMAIN set in your environment" && exit 1
[ -z "${ENV}" ] && echo "You must pass ENV as argument \$1" && exit 1
[ -z "${DEPLOYING_COLOR}" ] && echo "You must pass DEPLOYING_COLOR as argument \$2" && exit 1

REGION="us-east-1"
API_URL="https://api-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}"
WS_URL="wss://ws-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}"

PUBLIC_SITE_URL="https://${EFCMS_DOMAIN}"

USER_POOL_ID=$(aws cognito-idp list-user-pools --query "UserPools[?Name == 'efcms-${ENV}'].Id | [0]" --max-results 30 --region "${REGION}" --output text)

CLIENT_ID=$(aws cognito-idp list-user-pool-clients --user-pool-id "${USER_POOL_ID}" --query "UserPoolClients[?ClientName == 'client'].ClientId | [0]" --max-results 30 --region "${REGION}" --output text)

if [[ -z "${DYNAMSOFT_URL_OVERRIDE}" ]]; then
  SCANNER_RESOURCE_URI="https://dynamsoft-lib.${EFCMS_DOMAIN}/Dynamic%20Web%20TWAIN%20SDK%2017.2.5/Resources"
else
  SCANNER_RESOURCE_URI="${DYNAMSOFT_URL_OVERRIDE}/Dynamic%20Web%20TWAIN%20SDK%2017.2.5/Resources"
fi

STAGE="${CLIENT_STAGE}" \
  CIRCLE_SHA1="${CIRCLE_SHA1}" \
  EFCMS_DOMAIN="${EFCMS_DOMAIN}" \
  SESSION_TIMEOUT="${SESSION_TIMEOUT}" \
  SESSION_MODAL_TIMEOUT="${SESSION_MODAL_TIMEOUT}" \
  COGNITO_CLIENT_ID="${CLIENT_ID}" \
  SCANNER_RESOURCE_URI="${SCANNER_RESOURCE_URI}" \
  PDF_EXPRESS_LICENSE_KEY="${PDF_EXPRESS_LICENSE_KEY}" \
  WS_URL="${WS_URL}" \
  API_URL="${API_URL}" \
  PUBLIC_SITE_URL="${PUBLIC_SITE_URL}" \
  CI="" \
  npm run build:client
