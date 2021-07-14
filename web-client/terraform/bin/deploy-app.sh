#!/bin/bash

ENVIRONMENT=$1

BUCKET="${ZONE_NAME}.terraform.deploys"
KEY="ui-${ENVIRONMENT}.tfstate"
LOCK_TABLE=efcms-terraform-lock
REGION=us-east-1

tf_version=$(terraform --version)

if [[ ${tf_version} != *"1.0.0"* ]]; then
  echo "Please set your terraform version to 1.0.0 before deploying."
  exit 1
fi

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

DYNAMSOFT_URL="https://dynamsoft-lib.${EFCMS_DOMAIN}"

if [[ -z "${IS_DYNAMSOFT_ENABLED}" ]]
then
  IS_DYNAMSOFT_ENABLED="1"
fi

export TF_VAR_zone_name=$ZONE_NAME
export TF_VAR_dns_domain=$EFCMS_DOMAIN
export TF_VAR_environment=$ENVIRONMENT
export TF_VAR_dynamsoft_url=$DYNAMSOFT_URL
export TF_VAR_dynamsoft_product_keys=$DYNAMSOFT_PRODUCT_KEYS
export TF_VAR_dynamsoft_s3_zip_path=$DYNAMSOFT_S3_ZIP_PATH
export TF_VAR_is_dynamsoft_enabled=$IS_DYNAMSOFT_ENABLED
export TF_PLUGIN_CACHE_DIR=./terraform-cache
export TF_VAR_statuspage_dns_record=$STATUSPAGE_DNS_RECORD

terraform init -backend=true -backend-config=bucket="${BUCKET}" -backend-config=key="${KEY}" -backend-config=dynamodb_table="${LOCK_TABLE}" -backend-config=region="${REGION}"
terraform plan
terraform apply -auto-approve
