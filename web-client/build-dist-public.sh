#!/usr/bin/env bash
set -e

./check-env-variables.sh \
  "EFCMS_DOMAIN" \
  "ENV" \
  "DEPLOYING_COLOR" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

REGION="us-east-1"
API_URL="https://public-api-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}"
PUBLIC_SITE_URL="https://${EFCMS_DOMAIN}"

USER_POOL_ID=$(aws cognito-idp list-user-pools --query "UserPools[?Name == 'efcms-${ENV}'].Id | [0]" --max-results 30 --region "${REGION}" --output text)

CLIENT_ID=$(aws cognito-idp list-user-pool-clients --user-pool-id "${USER_POOL_ID}" --query "UserPoolClients[?ClientName == 'client'].ClientId | [0]" --max-results 30 --region "${REGION}" --output text)

# The public app reports to its own CloudWatch RUM monitor (separate from the
# client/private app monitor used by build-dist.sh).
RUM_APP_MONITOR_ID=$(aws rum list-app-monitors \
  --query "AppMonitorSummaries[?Name == '${ENV}_dawson_public_rum_app_monitor'].Id | [0]" \
  --region "us-east-1" \
  --output text)
RUM_IDENTITY_POOL_ID=$(aws rum get-app-monitor \
  --name "${ENV}_dawson_public_rum_app_monitor" \
  --query 'AppMonitor.AppMonitorConfiguration.IdentityPoolId' \
  --region "us-east-1" \
  --output text)

# Unique id per release used by CloudWatch RUM to locate the matching source
# maps. Must match the S3 folder the `.map` files are uploaded to
# (deploy-public.sh).
RUM_RELEASE_ID="${RUM_RELEASE_ID:-$CIRCLE_SHA1}"

STAGE="${ENV}" \
  COGNITO_CLIENT_ID="${CLIENT_ID}" \
  CIRCLE_SHA1="${CIRCLE_SHA1}" \
  EFCMS_DOMAIN="${EFCMS_DOMAIN}" \
  SESSION_TIMEOUT=3300000 \
  API_URL="${API_URL}" \
  PDF_EXPRESS_LICENSE_KEY="${PDF_EXPRESS_LICENSE_KEY}" \
  PUBLIC_SITE_URL="${PUBLIC_SITE_URL}" \
  CI="" \
  RUM_APP_MONITOR_ID="${RUM_APP_MONITOR_ID}" \
  RUM_IDENTITY_POOL_ID="${RUM_IDENTITY_POOL_ID}" \
  RUM_RELEASE_ID="${RUM_RELEASE_ID}" \
  RUM_SAMPLE_RATE="${RUM_SAMPLE_RATE}" \
  npm run build:public
