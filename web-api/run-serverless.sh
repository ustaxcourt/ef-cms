#!/bin/bash -e

slsStage=$1
region=$2

USER_POOL_ID=$(aws cognito-idp list-user-pools --query "UserPools[?Name == 'efcms-${slsStage}'].Id | [0]" --max-results 30 --region "us-east-1")
USER_POOL_ID="${USER_POOL_ID%\"}"
USER_POOL_ID="${USER_POOL_ID#\"}"

ACCOUNT_ID=$(aws sts get-caller-identity --query "Account")
ACCOUNT_ID="${ACCOUNT_ID%\"}"
ACCOUNT_ID="${ACCOUNT_ID#\"}"
export NODE_PRESERVE_SYMLINKS=1
cd src && find . -type f -exec chmod -R ugo+r {} ";"
cd ..
npm run build
cp dist/* src
SLS_DEPLOYMENT_BUCKET="${EFCMS_DOMAIN}.efcms.${slsStage}.${region}.deploys"
SLS_DEPLOYMENT_BUCKET="${SLS_DEPLOYMENT_BUCKET}" ./node_modules/.bin/sls create_domain --stage "${slsStage}" --region "${region}" --domain "${EFCMS_DOMAIN}" --userPoolId "${USER_POOL_ID}" --efcmsTableName="efcms-${slsStage}" --accountId "${ACCOUNT_ID}" --verbose

ENVIRONMENT="${slsStage}" SLS_DEPLOYMENT_BUCKET="${SLS_DEPLOYMENT_BUCKET}" ./node_modules/.bin/sls deploy --stage "${slsStage}" --region "${region}" --domain "${EFCMS_DOMAIN}"  --userPoolId "${USER_POOL_ID}" --verbose --efcmsTableName="efcms-${slsStage}" --accountId "${ACCOUNT_ID}"
./configure-custom-api-access-logging.sh "${slsStage}" ./config-custom-access-logs.json "${region}"
