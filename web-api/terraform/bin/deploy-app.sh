#!/bin/bash

ENVIRONMENT=$1

BUCKET="${ZONE_NAME}.terraform.deploys"
KEY="documents-${ENVIRONMENT}.tfstate"
LOCK_TABLE=efcms-terraform-lock
REGION=us-east-1

rm -rf .terraform
echo "Initiating provisioning for environment [${ENVIRONMENT}] in AWS region [${REGION}]"
sh ../bin/create-bucket.sh "${BUCKET}" "${KEY}" "${REGION}"

echo "checking for the dynamodb lock table..."
aws dynamodb list-tables --output json --region "${REGION}" --query "contains(TableNames, '${LOCK_TABLE}')" | grep 'true'
result=$?
if [ ${result} -ne 0 ]; then
  echo "dynamodb lock does not exist, creating"
  sh ../bin/create-dynamodb.sh "${LOCK_TABLE}" "${REGION}"
else
  echo "dynamodb lock table already exists"
fi

npm run build:assets

# build the cognito authorizer, api, and api-public with parcel
pushd ../template/lambdas
npx parcel build websockets.js cron.js streams.js log-forwarder.js cognito-authorizer.js cognito-triggers.js api-public.js api.js --target node --bundle-node-modules --no-minify
popd

# exit on any failure
set -eo pipefail

export TF_VAR_dns_domain=$EFCMS_DOMAIN
export TF_VAR_zone_name=$ZONE_NAME
export TF_VAR_environment=$ENVIRONMENT
export TF_VAR_cognito_suffix=$COGNITO_SUFFIX
export TF_VAR_email_dmarc_policy=$EMAIL_DMARC_POLICY
export TF_VAR_es_instance_count=$ES_INSTANCE_COUNT
export TF_VAR_honeybadger_key=$CIRCLE_HONEYBADGER_API_KEY
export TF_VAR_irs_superuser_email=$IRS_SUPERUSER_EMAIL

terraform init -backend=true -backend-config=bucket="${BUCKET}" -backend-config=key="${KEY}" -backend-config=dynamodb_table="${LOCK_TABLE}" -backend-config=region="${REGION}"
terraform plan
terraform apply -auto-approve
