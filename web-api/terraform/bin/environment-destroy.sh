#!/bin/bash

ENVIRONMENT=$1

BUCKET="${EFCMS_DOMAIN}.terraform.deploys"
KEY="documents-${ENVIRONMENT}.tfstate"
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

terraform init -backend=true -backend-config=bucket="${BUCKET}" -backend-config=key="${KEY}" -backend-config=dynamodb_table="${LOCK_TABLE}" -backend-config=region="${REGION}"
TF_VAR_my_s3_state_bucket="${BUCKET}" TF_VAR_my_s3_state_key="${KEY}" TF_WARN_OUTPUT_ERRORS=1 terraform destroy -auto-approve -var "dns_domain=${EFCMS_DOMAIN}" -var "zone_name=${ZONE_NAME}" -var "environment=${ENVIRONMENT}" -var "cognito_suffix=${COGNITO_SUFFIX}" -var "email_dmarc_policy=${EMAIL_DMARC_POLICY}" -var "es_instance_count=${ES_INSTANCE_COUNT}" -var "irs_superuser_email=${IRS_SUPERUSER_EMAIL}"
