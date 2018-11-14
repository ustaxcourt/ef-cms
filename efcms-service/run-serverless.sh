#!/bin/bash

slsStage=$1
region=$2
accountId=$(aws sts get-caller-identity --query "Account")
cd src && find . -type f -exec chmod -R ugo+r {} ";"
cd ..
SLS_DEPLOYMENT_BUCKET="${EFCMS_DOMAIN}.efcms.${slsStage}.${region}.deploys"
SLS_DEPLOYMENT_BUCKET="${SLS_DEPLOYMENT_BUCKET}" ./node_modules/.bin/sls create_domain --stage "${slsStage}" --region "${region}" --domain "${EFCMS_DOMAIN}" --verbose
ENVIRONMENT="${slsStage}" SLS_DEPLOYMENT_BUCKET="${SLS_DEPLOYMENT_BUCKET}" ./node_modules/.bin/sls deploy --stage "${slsStage}" --region "${region}" --domain "${EFCMS_DOMAIN}" --verbose --documentsTableName efcms-documents-"${slsStage}" --casesTableName efcms-cases-"${slsStage}" --accountId "${accountId}"
./configure-custom-api-access-logging.sh "${slsStage}" ./config-custom-access-logs.json "${region}"