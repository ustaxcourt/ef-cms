#!/bin/bash -e

slsStage="${1}"
region="${2}"
handler="${3}"
config="${4}"
build="${5}"

pushd ./web-api/terraform/main
  ../bin/deploy-init.sh "${slsStage}"
  ELASTICSEARCH_ENDPOINT="$(terraform output elasticsearch_endpoint)"
  export ELASTICSEARCH_ENDPOINT
popd

USER_POOL_ID=$(aws cognito-idp list-user-pools --query "UserPools[?Name == 'efcms-${slsStage}'].Id | [0]" --max-results 30 --region "us-east-1")
# remove quotes surrounding string
USER_POOL_ID="${USER_POOL_ID%\"}"
USER_POOL_ID="${USER_POOL_ID#\"}"

USER_POOL_IRS_ID=$(aws cognito-idp list-user-pools --query "UserPools[?Name == 'efcms-irs-${slsStage}'].Id | [0]" --max-results 30 --region "us-east-1")
USER_POOL_IRS_ID="${USER_POOL_IRS_ID%\"}"
USER_POOL_IRS_ID="${USER_POOL_IRS_ID#\"}"

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

CURRENT_COLOR=$(aws dynamodb get-item --region us-east-1 --table-name "efcms-deploy-${slsStage}" --key '{"pk":{"S":"deployed-stack"},"sk":{"S":"deployed-stack"}}' | jq -r ".Item.current.S")

echo "current color: ${CURRENT_COLOR}"

if [[ $CURRENT_COLOR == 'green' ]] ; then
  NEW_COLOR='blue'
else
  NEW_COLOR='green'
fi

echo "new color: ${NEW_COLOR}"

set -- \
  --accountId "${ACCOUNT_ID}" \
  --config "./web-api/${config}" \
  --domain "${EFCMS_DOMAIN}" \
  --efcmsTableName="efcms-${slsStage}" \
  --region "${region}" \
  --stage "${slsStage}" \
  --stageColor "${NEW_COLOR}" \
  --userPoolId "${USER_POOL_ID}" \
  --userPoolIrsId "${USER_POOL_IRS_ID}" \
  --dynamo_stream_arn="${DYNAMO_STREAM_ARN}" \
  --elasticsearch_endpoint="${ELASTICSEARCH_ENDPOINT}" \
  --circleHoneybadgerApiKey="${CIRCLE_HONEYBADGER_API_KEY}" \
  --irsSuperuserEmail="${IRS_SUPERUSER_EMAIL}" \
  --verbose

./node_modules/.bin/sls create_domain "$@"
echo "done running create_domain"

ENVIRONMENT="${slsStage}" ./node_modules/.bin/sls deploy --verbose "$@"
echo "done running sls deploy"

echo "slsStage: ${slsStage}"
echo "region: ${region}"

cp "/tmp/${handler}" src
