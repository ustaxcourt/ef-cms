#!/bin/bash

pushd ../management/management
SKIP_KEYGEN=true ./deploy-init.sh
DNS_DOMAIN=$(terraform output dns_domain)
popd

slsStage=$1
region=$2
cd src && find . -type f -exec chmod -R ugo+r {} ";"
cd ..
SLS_DEPLOYMENT_BUCKET="${DNS_DOMAIN}.apis.${slsStage}.${region}.deploys" ./node_modules/.bin/sls create_domain --stage "${slsStage}" --region "${region}" --verbose
ENVIRONMENT="${slsStage}" SLS_DEPLOYMENT_BUCKET="${DNS_DOMAIN}.apis.${slsStage}.${region}.deploys" ./node_modules/.bin/sls deploy --stage "${slsStage}" --region "${region}" --verbose
./configure-custom-api-access-logging.sh "${slsStage}" ./config-custom-access-logs.json "${region}"