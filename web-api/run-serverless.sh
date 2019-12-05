#!/bin/bash -e

slsStage="${1}"
region="${2}"
handler="${3}"
config="${4}"
build="${5}"

USER_POOL_ID=$(aws cognito-idp list-user-pools --query "UserPools[?Name == 'efcms-${slsStage}'].Id | [0]" --max-results 30 --region "us-east-1")
# remove quotes surrounding string
USER_POOL_ID="${USER_POOL_ID%\"}"
USER_POOL_ID="${USER_POOL_ID#\"}"

ACCOUNT_ID=$(aws sts get-caller-identity --query "Account")
# remove quotes surrounding string
ACCOUNT_ID="${ACCOUNT_ID%\"}"
ACCOUNT_ID="${ACCOUNT_ID#\"}"
export NODE_PRESERVE_SYMLINKS=1
find ./web-api/src -type f -exec chmod -R ugo+r {} ";"

npm run build:assets
npm run "${build}"
cp "./web-api/src/${handler}" /tmp
cp "./dist/${handler}" web-api/src

export SLS_DEPLOYMENT_BUCKET="${EFCMS_DOMAIN}.efcms.${slsStage}.${region}.deploys"
export SLS_DEBUG="*"

./node_modules/.bin/sls create_domain \
  --accountId "${ACCOUNT_ID}" \
  --config "./web-api/${config}" \
  --domain "${EFCMS_DOMAIN}" \
  --efcmsTableName="efcms-${slsStage}" \
  --region "${region}" \
  --stage "${slsStage}" \
  --userPoolId "${USER_POOL_ID}" \
  --dynamo_stream_arn="${DYNAMO_STREAM_ARN}" \
  --elasticsearch_endpoint="${ELASTICSEARCH_ENDPOINT}" \
  --verbose
echo "done running create_domain"

ENVIRONMENT="${slsStage}" ./node_modules/.bin/sls deploy \
  --accountId "${ACCOUNT_ID}" \
  --config "./web-api/${config}" \
  --domain "${EFCMS_DOMAIN}"  \
  --efcmsTableName="efcms-${slsStage}" \
  --region "${region}" \
  --stage "${slsStage}" \
  --userPoolId "${USER_POOL_ID}" \
  --dynamo_stream_arn="${DYNAMO_STREAM_ARN}" \
  --elasticsearch_endpoint="${ELASTICSEARCH_ENDPOINT}" \
  --verbose
echo "done running sls deploy"

echo "slsStage: ${slsStage}"
echo "region: ${region}"

cp "/tmp/${handler}" src
