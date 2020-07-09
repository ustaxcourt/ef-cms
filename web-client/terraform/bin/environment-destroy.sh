#!/bin/bash

ENVIRONMENT=$1

BUCKET="${EFCMS_DOMAIN}.terraform.deploys"
KEY="ui-${ENVIRONMENT}.tfstate"
LOCK_TABLE=efcms-terraform-lock
REGION=us-east-1

if [ -z "$ENVIRONMENT" ]; then
  echo "Please specify the environment"
  exit 1
fi

if [ -z "$EFCMS_DOMAIN" ]; then
  echo "Please export the EFCMS_DOMAIN variable in your shell"
  exit 1
fi

rm -rf .terraform

DYNAMSOFT_URL="https://dynamsoft-lib-${ENVIRONMENT}.${EFCMS_DOMAIN}"

if [[ -z "${IS_DYNAMSOFT_ENABLED}" ]]
then
  IS_DYNAMSOFT_ENABLED="1"
fi

terraform init -backend=true -backend-config=bucket="${BUCKET}" -backend-config=key="${KEY}" -backend-config=dynamodb_table="${LOCK_TABLE}" -backend-config=region="${REGION}"
TF_VAR_my_s3_state_bucket="${BUCKET}" TF_VAR_my_s3_state_key="${KEY}" TF_WARN_OUTPUT_ERRORS=1 terraform destroy -auto-approve -var "dns_domain=${EFCMS_DOMAIN}" -var "environment=${ENVIRONMENT}" -var "dynamsoft_url=${DYNAMSOFT_URL}"  -var "dynamsoft_product_keys=${DYNAMSOFT_PRODUCT_KEYS}" -var "dynamsoft_s3_zip_path=${DYNAMSOFT_S3_ZIP_PATH}" -var "is_dynamsoft_enabled=${IS_DYNAMSOFT_ENABLED}"
