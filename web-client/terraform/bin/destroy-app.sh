#!/bin/bash

ENVIRONMENT=$1

[ -z "${EFCMS_DOMAIN}" ] && echo "You must have EFCMS_DOMAIN set in your environment" && exit 1
[ -z "${ENVIRONMENT}" ] && echo "You must have ENVIRONMENT set in your environment" && exit 1
[ -z "${ZONE_NAME}" ] && echo "You must have ZONE_NAME set in your environment" && exit 1

echo "Running terraform with the following environment configs:"
echo "  - EFCMS_DOMAIN=${EFCMS_DOMAIN}"
echo "  - ENVIRONMENT=${ENVIRONMENT}"
echo "  - ZONE_NAME=${ZONE_NAME}"

tf_version=$(terraform --version)

if [[ ${tf_version} != *"1.0.7"* ]]; then
  echo "Please set your terraform version to 1.0.7 before deploying."
  exit 1
fi

BUCKET="${ZONE_NAME}.terraform.deploys"
KEY="ui-${ENVIRONMENT}.tfstate"
LOCK_TABLE=efcms-terraform-lock
REGION=us-east-1

rm -rf .terraform

DYNAMSOFT_URL="https://dynamsoft-lib-${ENVIRONMENT}.${EFCMS_DOMAIN}"

if [[ -z "${IS_DYNAMSOFT_ENABLED}" ]]
then
  IS_DYNAMSOFT_ENABLED="1"
fi

#deploying color
#disable emails
export TF_VAR_blue_elasticsearch_domain=$BLUE_ELASTICSEARCH_DOMAIN
export TF_VAR_blue_table_name=$BLUE_TABLE_NAME
export TF_VAR_bounced_email_recipient=$BOUNCED_EMAIL_RECIPIENT
export TF_VAR_cognito_suffix=$COGNITO_SUFFIX
export TF_VAR_cognito_table_name=$COGNITO_TRIGGER_TABLE_NAME
export TF_VAR_destination_table=$DESTINATION_TABLE
export TF_VAR_dns_domain=$EFCMS_DOMAIN
export TF_VAR_dynamsoft_product_keys=$DYNAMSOFT_PRODUCT_KEYS
export TF_VAR_dynamsoft_s3_zip_path=$DYNAMSOFT_S3_ZIP_PATH
export TF_VAR_dynamsoft_url=$DYNAMSOFT_URL
export TF_VAR_email_dmarc_policy=$EMAIL_DMARC_POLICY
export TF_VAR_environment=$ENVIRONMENT
export TF_VAR_es_instance_count=$ES_INSTANCE_COUNT 
export TF_VAR_es_instance_type=$ES_INSTANCE_TYPE
export TF_VAR_es_volume_size=$ES_VOLUME_SIZE
export TF_VAR_green_elasticsearch_domain=$GREEN_ELASTICSEARCH_DOMAIN
export TF_VAR_green_table_name=$GREEN_TABLE_NAME
export TF_VAR_irs_superuser_email=$IRS_SUPERUSER_EMAIL
export TF_VAR_is_dynamsoft_enabled=$IS_DYNAMSOFT_ENABLED
export TF_VAR_my_s3_state_bucket=$BUCKET
export TF_VAR_my_s3_state_key=$KEY
export TF_VAR_scanner_resource_uri=$SCANNER_RESOURCE_URI
export TF_VAR_zone_name=$ZONE_NAME
export TF_WARN_OUTPUT_ERRORS=1

terraform init -backend=true -backend-config=bucket="${BUCKET}" -backend-config=key="${KEY}" -backend-config=dynamodb_table="${LOCK_TABLE}" -backend-config=region="${REGION}"
terraform plan -destroy -out execution-plan
terraform destroy -auto-approve
