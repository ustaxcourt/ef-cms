#!/bin/bash

ENVIRONMENT=$1

[ -z "${ENVIRONMENT}" ] && echo "You must have ENVIRONMENT set in your environment" && exit 1
[ -z "${CIRCLE_BRANCH}" ] && echo "You must have CIRCLE_BRANCH set in your environment" && exit 1
[ -z "${MIGRATE_FLAG}" ] && echo "You must have MIGRATE_FLAG set in your environment" && exit 1
[ -z "${DEPLOYING_COLOR}" ] && echo "You must have DEPLOYING_COLOR set in your environment" && exit 1
[ -z "${ZONE_NAME}" ] && echo "You must have ZONE_NAME set in your environment" && exit 1
[ -z "${EFCMS_DOMAIN}" ] && echo "You must have EFCMS_DOMAIN set in your environment" && exit 1
[ -z "${COGNITO_SUFFIX}" ] && echo "You must have COGNITO_SUFFIX set in your environment" && exit 1
[ -z "${EMAIL_DMARC_POLICY}" ] && echo "You must have EMAIL_DMARC_POLICY set in your environment" && exit 1
[ -z "${IRS_SUPERUSER_EMAIL}" ] && echo "You must have IRS_SUPERUSER_EMAIL set in your environment" && exit 1
[ -z "${ES_INSTANCE_TYPE}" ] && echo "You must have ES_INSTANCE_TYPE set in your environment" && exit 1
[ -z "${DISABLE_EMAILS}" ] && echo "You must have DISABLE_EMAILS set in your environment" && exit 1
[ -z "${ES_VOLUME_SIZE}" ] && echo "You must have ES_VOLUME_SIZE set in your environment" && exit 1


echo "Running terraform with the following environment configs:"
echo "  - ENVIRONMENT=${ENVIRONMENT}"
echo "  - CIRCLE_BRANCH=${CIRCLE_BRANCH}"
echo "  - MIGRATE_FLAG=${MIGRATE_FLAG}"
echo "  - DEPLOYING_COLOR=${DEPLOYING_COLOR}"
echo "  - ZONE_NAME=${ZONE_NAME}"
echo "  - EFCMS_DOMAIN=${EFCMS_DOMAIN}"
echo "  - COGNITO_SUFFIX=${COGNITO_SUFFIX}"
echo "  - EMAIL_DMARC_POLICY=${EMAIL_DMARC_POLICY}"
echo "  - IRS_SUPERUSER_EMAIL=${IRS_SUPERUSER_EMAIL}"
echo "  - ES_INSTANCE_TYPE=${ES_INSTANCE_TYPE}"
echo "  - DISABLE_EMAILS=${DISABLE_EMAILS}"
echo "  - ES_VOLUME_SIZE=${ES_VOLUME_SIZE}"
echo "  - BOUNCED_EMAIL_RECIPIENT=${BOUNCED_EMAIL_RECIPIENT}"

tf_version=$(terraform --version)

if [[ ${tf_version} != *"1.0.2"* ]]; then
  echo "Please set your terraform version to 1.0.2 before deploying."
  exit 1
fi

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

# exit on any failure
set -eo pipefail
# build the cognito authorizer, api, and api-public with web pack
npm run build:lambda:api

if [ "${MIGRATE_FLAG}" == 'false' ]; then
  BLUE_TABLE_NAME=$(../../../scripts/get-destination-table.sh $ENVIRONMENT)
  GREEN_TABLE_NAME=$(../../../scripts/get-destination-table.sh $ENVIRONMENT)
  BLUE_ELASTICSEARCH_DOMAIN=$(../../../scripts/get-destination-elasticsearch.sh $ENVIRONMENT)
  GREEN_ELASTICSEARCH_DOMAIN=$(../../../scripts/get-destination-elasticsearch.sh $ENVIRONMENT)
  COGNITO_TRIGGER_TABLE_NAME=$(../../../scripts/get-destination-table.sh $ENVIRONMENT)
else
  if [ "${DEPLOYING_COLOR}" == 'blue' ]; then
    BLUE_TABLE_NAME=$(../../../scripts/get-destination-table.sh $ENVIRONMENT)
    GREEN_TABLE_NAME=$(../../../scripts/get-source-table.sh $ENVIRONMENT)
    BLUE_ELASTICSEARCH_DOMAIN=$(../../../scripts/get-destination-elasticsearch.sh $ENVIRONMENT)
    GREEN_ELASTICSEARCH_DOMAIN=$(../../../scripts/get-source-elasticsearch.sh $ENVIRONMENT)
    COGNITO_TRIGGER_TABLE_NAME=$(../../../scripts/get-source-table.sh $ENVIRONMENT)
  else
    GREEN_TABLE_NAME=$(../../../scripts/get-destination-table.sh $ENVIRONMENT)
    BLUE_TABLE_NAME=$(../../../scripts/get-source-table.sh $ENVIRONMENT)
    GREEN_ELASTICSEARCH_DOMAIN=$(../../../scripts/get-destination-elasticsearch.sh $ENVIRONMENT)
    BLUE_ELASTICSEARCH_DOMAIN=$(../../../scripts/get-source-elasticsearch.sh $ENVIRONMENT)
    COGNITO_TRIGGER_TABLE_NAME=$(../../../scripts/get-source-table.sh $ENVIRONMENT)
  fi
fi

if [[ -z "${DYNAMSOFT_URL_OVERRIDE}" ]]; then
  SCANNER_RESOURCE_URI="https://dynamsoft-lib.${EFCMS_DOMAIN}/dynamic-web-twain-sdk-14.3.1"
else
  SCANNER_RESOURCE_URI="${DYNAMSOFT_URL_OVERRIDE}/dynamic-web-twain-sdk-14.3.1"
fi

export TF_VAR_dns_domain=$EFCMS_DOMAIN
export TF_VAR_zone_name=$ZONE_NAME
export TF_VAR_environment=$ENVIRONMENT
export TF_VAR_cognito_suffix=$COGNITO_SUFFIX
export TF_VAR_email_dmarc_policy=$EMAIL_DMARC_POLICY
export TF_VAR_es_instance_count=$ES_INSTANCE_COUNT
export TF_VAR_es_instance_type=$ES_INSTANCE_TYPE
export TF_VAR_irs_superuser_email=$IRS_SUPERUSER_EMAIL
export TF_VAR_deploying_color=$DEPLOYING_COLOR
export TF_VAR_blue_table_name=$BLUE_TABLE_NAME
export TF_VAR_green_table_name=$GREEN_TABLE_NAME
export TF_VAR_blue_elasticsearch_domain=$BLUE_ELASTICSEARCH_DOMAIN
export TF_VAR_green_elasticsearch_domain=$GREEN_ELASTICSEARCH_DOMAIN
export TF_VAR_destination_table=$DESTINATION_TABLE
export TF_VAR_disable_emails=$DISABLE_EMAILS
export TF_VAR_es_volume_size=$ES_VOLUME_SIZE
export TF_VAR_bounced_email_recipient=$BOUNCED_EMAIL_RECIPIENT
export TF_VAR_scanner_resource_uri=$SCANNER_RESOURCE_URI
export TF_VAR_cognito_table_name=$COGNITO_TRIGGER_TABLE_NAME

terraform init -backend=true -backend-config=bucket="${BUCKET}" -backend-config=key="${KEY}" -backend-config=dynamodb_table="${LOCK_TABLE}" -backend-config=region="${REGION}"
terraform plan -out execution-plan
terraform apply -auto-approve execution-plan
