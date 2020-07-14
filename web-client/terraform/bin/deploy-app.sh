#!/bin/bash

ENVIRONMENT=$1

BUCKET="${EFCMS_DOMAIN}.terraform.deploys"
KEY="ui-${ENVIRONMENT}.tfstate"
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

# exit on any failure
set -eo pipefail

DYNAMSOFT_URL="https://dynamsoft-lib-${ENVIRONMENT}.${EFCMS_DOMAIN}"

if [[ -z "${IS_DYNAMSOFT_ENABLED}" ]]
then
  IS_DYNAMSOFT_ENABLED="1"
fi

terraform init -backend=true -backend-config=bucket="${BUCKET}" -backend-config=key="${KEY}" -backend-config=dynamodb_table="${LOCK_TABLE}" -backend-config=region="${REGION}"
TF_VAR_my_s3_state_bucket="${BUCKET}" TF_VAR_my_s3_state_key="${KEY}" terraform apply -auto-approve -var "dns_domain=${EFCMS_DOMAIN}" -var "environment=${ENVIRONMENT}" -var "dynamsoft_url=${DYNAMSOFT_URL}"  -var "dynamsoft_product_keys=${DYNAMSOFT_PRODUCT_KEYS}" -var "dynamsoft_s3_zip_path=${DYNAMSOFT_S3_ZIP_PATH}" -var "is_dynamsoft_enabled=${IS_DYNAMSOFT_ENABLED}"
