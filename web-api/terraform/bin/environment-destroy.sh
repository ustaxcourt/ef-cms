#!/bin/bash

ENVIRONMENT=$1

BUCKET="${ZONE_NAME}.terraform.deploys"
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

if [ -z "$ZONE_NAME" ]; then
  echo "Please export the ZONE_NAME variable in your shell"
  exit 1
fi

rm -rf .terraform

BLUE_TABLE_NAME=$(../../../scripts/get-destination-table.sh $ENVIRONMENT)
GREEN_TABLE_NAME=$(../../../scripts/get-source-table.sh $ENVIRONMENT)
BLUE_ELASTICSEARCH_DOMAIN=$(../../../scripts/get-destination-elasticsearch.sh $ENVIRONMENT)
GREEN_ELASTICSEARCH_DOMAIN=$(../../../scripts/get-source-elasticsearch.sh $ENVIRONMENT)

export TF_VAR_blue_table_name=$BLUE_TABLE_NAME
export TF_VAR_green_table_name=$GREEN_TABLE_NAME
export TF_VAR_blue_elasticsearch_domain=$BLUE_ELASTICSEARCH_DOMAIN
export TF_VAR_green_elasticsearch_domain=$GREEN_ELASTICSEARCH_DOMAIN
export TF_VAR_dns_domain=$EFCMS_DOMAIN
export TF_VAR_zone_name=$ZONE_NAME
export TF_VAR_environment=$ENVIRONMENT
export TF_VAR_cognito_suffix=$COGNITO_SUFFIX
export TF_VAR_email_dmarc_policy=$EMAIL_DMARC_POLICY
export TF_VAR_es_instance_count=$ES_INSTANCE_COUNT 
export TF_VAR_irs_superuser_email=$IRS_SUPERUSER_EMAIL
export TF_VAR_destination_table="efcms-${ENVIRONMENT}"
export TF_VAR_bounced_email_recipient=$BOUNCED_EMAIL_RECIPIENT

export TF_VAR_my_s3_state_bucket=$BUCKET
export TF_VAR_my_s3_state_key=$KEY
export TF_WARN_OUTPUT_ERRORS=1

terraform init -backend=true -backend-config=bucket="${BUCKET}" -backend-config=key="${KEY}" -backend-config=dynamodb_table="${LOCK_TABLE}" -backend-config=region="${REGION}"
terraform destroy -auto-approve  
