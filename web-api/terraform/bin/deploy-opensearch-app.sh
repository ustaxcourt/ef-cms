#!/bin/bash -e

ENV=$1

DEPLOYING_COLOR=$(../../../scripts/dynamo/get-deploying-color.sh "${ENV}")
MIGRATE_FLAG=$(../../../scripts/dynamo/get-migrate-flag.sh "${ENV}")

export DEPLOYING_COLOR
export MIGRATE_FLAG

# Getting the environment-specific deployment settings and injecting them into the shell environment
if [ -z "${SECRETS_LOADED}" ]; then
  pushd ../../../
  # shellcheck disable=SC1091
  . ./scripts/load-environment-from-secrets.sh
  popd
fi

[ -z "${COGNITO_SUFFIX}" ] && echo "You must have COGNITO_SUFFIX set in your environment" && exit 1
[ -z "${DEFAULT_ACCOUNT_PASS}" ] && echo "You must have DEFAULT_ACCOUNT_PASS set in your environment" && exit 1
[ -z "${DEPLOYING_COLOR}" ] && echo "You must have DEPLOYING_COLOR set in your environment" && exit 1
[ -z "${DISABLE_EMAILS}" ] && echo "You must have DISABLE_EMAILS set in your environment" && exit 1
[ -z "${EFCMS_DOMAIN}" ] && echo "You must have EFCMS_DOMAIN set in your environment" && exit 1
[ -z "${EMAIL_DMARC_POLICY}" ] && echo "You must have EMAIL_DMARC_POLICY set in your environment" && exit 1
[ -z "${ENABLE_HEALTH_CHECKS}" ] && echo "You must have ENABLE_HEALTH_CHECKS set in your environment" && exit 1
[ -z "${ENV}" ] && echo "You must have ENV set in your environment" && exit 1
[ -z "${ES_INSTANCE_TYPE}" ] && echo "You must have ES_INSTANCE_TYPE set in your environment" && exit 1
[ -z "${ES_VOLUME_SIZE}" ] && echo "You must have ES_VOLUME_SIZE set in your environment" && exit 1
[ -z "${IRS_SUPERUSER_EMAIL}" ] && echo "You must have IRS_SUPERUSER_EMAIL set in your environment" && exit 1
[ -z "${MIGRATE_FLAG}" ] && echo "You must have MIGRATE_FLAG set in your environment" && exit 1
[ -z "${ZONE_NAME}" ] && echo "You must have ZONE_NAME set in your environment" && exit 1

echo "Running terraform with the following environment configs:"
echo "  - BOUNCED_EMAIL_RECIPIENT=${BOUNCED_EMAIL_RECIPIENT}"
echo "  - BOUNCE_ALERT_RECIPIENTS=${BOUNCE_ALERT_RECIPIENTS}"
echo "  - DEFAULT_ACCOUNT_PASS=${DEFAULT_ACCOUNT_PASS}"
echo "  - SLACK_WEBHOOK_URL=${SLACK_WEBHOOK_URL}"
echo "  - CIRCLE_BRANCH=${CIRCLE_BRANCH}"
echo "  - COGNITO_SUFFIX=${COGNITO_SUFFIX}"
echo "  - DEPLOYING_COLOR=${DEPLOYING_COLOR}"
echo "  - DISABLE_EMAILS=${DISABLE_EMAILS}"
echo "  - EFCMS_DOMAIN=${EFCMS_DOMAIN}"
echo "  - EMAIL_DMARC_POLICY=${EMAIL_DMARC_POLICY}"
echo "  - ENABLE_HEALTH_CHECKS=${ENABLE_HEALTH_CHECKS}"
echo "  - ENV=${ENV}"
echo "  - ES_INSTANCE_TYPE=${ES_INSTANCE_TYPE}"
echo "  - ES_VOLUME_SIZE=${ES_VOLUME_SIZE}"
echo "  - IRS_SUPERUSER_EMAIL=${IRS_SUPERUSER_EMAIL}"
echo "  - LOWER_ENV_ACCOUNT_ID=${LOWER_ENV_ACCOUNT_ID}"
echo "  - MIGRATE_FLAG=${MIGRATE_FLAG}"
echo "  - PROD_ENV_ACCOUNT_ID=${PROD_ENV_ACCOUNT_ID}"
echo "  - ZONE_NAME=${ZONE_NAME}"

../../../scripts/verify-terraform-version.sh

BUCKET="${ZONE_NAME}.terraform.deploys"
KEY="documents-${ENV}.tfstate"
LOCK_TABLE=efcms-terraform-lock

rm -rf .terraform

echo "Initiating provisioning for environment [${ENV}] in AWS region [${REGION}]"
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

if [ -z "${CIRCLE_BRANCH}" ]; then
  pushd ../../runtimes/puppeteer/
  sh build-local.sh
  popd
fi

if [ "${MIGRATE_FLAG}" == 'false' ]; then
  BLUE_TABLE_NAME=$(../../../scripts/dynamo/get-destination-table.sh "${ENV}")
  GREEN_TABLE_NAME=$(../../../scripts/dynamo/get-destination-table.sh "${ENV}")
  DESTINATION_DOMAIN=$(../../../scripts/elasticsearch/get-destination-elasticsearch.sh "${ENV}")
  BLUE_ELASTICSEARCH_DOMAIN="${DESTINATION_DOMAIN}"
  GREEN_ELASTICSEARCH_DOMAIN="${DESTINATION_DOMAIN}"
  COGNITO_TRIGGER_TABLE_NAME=$(../../../scripts/dynamo/get-destination-table.sh "${ENV}")

  if [[ "${DESTINATION_DOMAIN}" == *'alpha'* ]]; then
    SHOULD_ES_ALPHA_EXIST=true
    SHOULD_ES_BETA_EXIST=false
  else
    SHOULD_ES_ALPHA_EXIST=false
    SHOULD_ES_BETA_EXIST=true
  fi
else
  SHOULD_ES_ALPHA_EXIST=true
  SHOULD_ES_BETA_EXIST=true

  if [ "${DEPLOYING_COLOR}" == 'blue' ]; then
    BLUE_TABLE_NAME=$(../../../scripts/dynamo/get-destination-table.sh "${ENV}")
    GREEN_TABLE_NAME=$(../../../scripts/dynamo/get-source-table.sh "${ENV}")
    BLUE_ELASTICSEARCH_DOMAIN=$(../../../scripts/elasticsearch/get-destination-elasticsearch.sh "${ENV}")
    GREEN_ELASTICSEARCH_DOMAIN=$(../../../scripts/elasticsearch/get-source-elasticsearch.sh "${ENV}")
    COGNITO_TRIGGER_TABLE_NAME=$(../../../scripts/dynamo/get-source-table.sh "${ENV}")
  else
    GREEN_TABLE_NAME=$(../../../scripts/dynamo/get-destination-table.sh "${ENV}")
    BLUE_TABLE_NAME=$(../../../scripts/dynamo/get-source-table.sh "${ENV}")
    GREEN_ELASTICSEARCH_DOMAIN=$(../../../scripts/elasticsearch/get-destination-elasticsearch.sh "${ENV}")
    BLUE_ELASTICSEARCH_DOMAIN=$(../../../scripts/elasticsearch/get-source-elasticsearch.sh "${ENV}")
    COGNITO_TRIGGER_TABLE_NAME=$(../../../scripts/dynamo/get-source-table.sh "${ENV}")
  fi
fi

# // 1. fetch current node version (16.x) from dynamo
#   // pass that to terraform (current_color <- current_node_version)
# // 2. fetch deploying node version (18.x) from dynamo
#   // pass that to terraform (deploing_color <- deploying_node_version)

if [ "${DEPLOYING_COLOR}" == 'blue' ]; then
  GREEN_NODE_VERSION=$(../../../scripts/dynamo/get-current-node-version.sh "${ENV}")
  BLUE_NODE_VERSION=$(../../../scripts/dynamo/get-deploying-node-version.sh "${ENV}")
  GREEN_USE_LAYERS=$(../../../scripts/dynamo/get-current-use-layers.sh "${ENV}")
  BLUE_USE_LAYERS=$(../../../scripts/dynamo/get-deploying-use-layers.sh "${ENV}")
else
  BLUE_NODE_VERSION=$(../../../scripts/dynamo/get-current-node-version.sh "${ENV}")
  GREEN_NODE_VERSION=$(../../../scripts/dynamo/get-deploying-node-version.sh "${ENV}")
  BLUE_USE_LAYERS=$(../../../scripts/dynamo/get-current-use-layers.sh "${ENV}")
  GREEN_USE_LAYERS=$(../../../scripts/dynamo/get-deploying-use-layers.sh "${ENV}")
fi

if [[ -z "${DYNAMSOFT_URL_OVERRIDE}" ]]; then
  SCANNER_RESOURCE_URI="https://dynamsoft-lib.${EFCMS_DOMAIN}/Dynamic%20Web%20TWAIN%20SDK%2017.2.5/Resources"
else
  SCANNER_RESOURCE_URI="${DYNAMSOFT_URL_OVERRIDE}/Dynamic%20Web%20TWAIN%20SDK%2017.2.5/Resources"
fi

DEPLOYMENT_TIMESTAMP=$(date "+%s")

export TF_VAR_blue_elasticsearch_domain=$BLUE_ELASTICSEARCH_DOMAIN
export TF_VAR_blue_node_version=$BLUE_NODE_VERSION
export TF_VAR_blue_table_name=$BLUE_TABLE_NAME
export TF_VAR_blue_use_layers=$BLUE_USE_LAYERS
export TF_VAR_bounce_alert_recipients=$BOUNCE_ALERT_RECIPIENTS
export TF_VAR_bounced_email_recipient=$BOUNCED_EMAIL_RECIPIENT
export TF_VAR_cognito_suffix=$COGNITO_SUFFIX
export TF_VAR_cognito_table_name=$COGNITO_TRIGGER_TABLE_NAME
export TF_VAR_default_account_pass=$DEFAULT_ACCOUNT_PASS
export TF_VAR_deploying_color=$DEPLOYING_COLOR
export TF_VAR_deployment_timestamp=$DEPLOYMENT_TIMESTAMP
export TF_VAR_destination_table=$DESTINATION_TABLE
export TF_VAR_disable_emails=$DISABLE_EMAILS
export TF_VAR_dns_domain=$EFCMS_DOMAIN
export TF_VAR_email_dmarc_policy=$EMAIL_DMARC_POLICY
export TF_VAR_enable_health_checks=$ENABLE_HEALTH_CHECKS
export TF_VAR_environment=$ENV
export TF_VAR_es_instance_count=$ES_INSTANCE_COUNT
export TF_VAR_es_instance_type=$ES_INSTANCE_TYPE
export TF_VAR_es_volume_size=$ES_VOLUME_SIZE
export TF_VAR_green_elasticsearch_domain=$GREEN_ELASTICSEARCH_DOMAIN
export TF_VAR_green_node_version=$GREEN_NODE_VERSION
export TF_VAR_green_table_name=$GREEN_TABLE_NAME
export TF_VAR_green_use_layers=$GREEN_USE_LAYERS
export TF_VAR_irs_superuser_email=$IRS_SUPERUSER_EMAIL
export TF_VAR_lower_env_account_id=$LOWER_ENV_ACCOUNT_ID
export TF_VAR_prod_env_account_id=$PROD_ENV_ACCOUNT_ID
export TF_VAR_scanner_resource_uri=$SCANNER_RESOURCE_URI
export TF_VAR_should_es_alpha_exist=$SHOULD_ES_ALPHA_EXIST
export TF_VAR_should_es_beta_exist=$SHOULD_ES_BETA_EXIST
export TF_VAR_slack_webhook_url=$SLACK_WEBHOOK_URL
export TF_VAR_zone_name=$ZONE_NAME

terraform init -backend=true -backend-config=bucket="${BUCKET}" -backend-config=key="${KEY}" -backend-config=dynamodb_table="${LOCK_TABLE}" -backend-config=region="${REGION}"
# Please replace <SOURCE_TABLE_VERSION> and <ENVIRONMENT> instances
terraform state rm module.ef-cms_apis.module.elasticsearch_beta[0].aws_elasticsearch_domain.efcms-search
echo "I finished removal"
terraform state list
# terraform import module.ef-cms_apis.module.elasticsearch_beta[0].aws_opensearch_domain.efcms-search efcms-search-exp3-beta
# terraform plan
