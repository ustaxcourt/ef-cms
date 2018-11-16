#!/bin/bash

slsStage=$1
region=$2
ACCOUNT_ID=$(aws sts get-caller-identity --query "Account")
ACCOUNT_ID="${ACCOUNT_ID%\"}"
ACCOUNT_ID="${ACCOUNT_ID#\"}"
cd src && find . -type f -exec chmod -R ugo+r {} ";"
cd ..
SLS_DEPLOYMENT_BUCKET="${EFCMS_DOMAIN}.efcms.${slsStage}.${region}.deploys"
SLS_DEPLOYMENT_BUCKET="${SLS_DEPLOYMENT_BUCKET}" ./node_modules/.bin/sls create_domain --stage "${slsStage}" --region "${region}" --domain "${EFCMS_DOMAIN}"  --documentsTableName "efcms-documents-${slsStage}" --casesTableName "efcms-cases-${slsStage}" --accountId "${ACCOUNT_ID}" --verbose
ENVIRONMENT="${slsStage}" SLS_DEPLOYMENT_BUCKET="${SLS_DEPLOYMENT_BUCKET}" ./node_modules/.bin/sls deploy --stage "${slsStage}" --region "${region}" --domain "${EFCMS_DOMAIN}" --verbose --documentsTableName "efcms-documents-${slsStage}" --casesTableName "efcms-cases-${slsStage}" --accountId "${ACCOUNT_ID}"
./configure-custom-api-access-logging.sh "${slsStage}" ./config-custom-access-logs.json "${region}"