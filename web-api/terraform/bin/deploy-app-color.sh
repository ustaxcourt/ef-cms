#!/bin/bash -e

ENV=$1

DEPLOYING_COLOR=$(../../../../scripts/dynamo/get-deploying-color.sh "${ENV}")
MIGRATE_FLAG=$(../../../../scripts/dynamo/get-migrate-flag.sh "${ENV}")

export DEPLOYING_COLOR
export MIGRATE_FLAG

# Getting the environment-specific deployment settings and injecting them into the shell environment
if [ -z "${SECRETS_LOADED}" ]; then
  pushd ../../../../
  # shellcheck disable=SC1091
  . ./scripts/load-environment-from-secrets.sh
  popd
fi

[ -z "${COGNITO_SUFFIX}" ] && echo "You must have COGNITO_SUFFIX set in your environment" && exit 1
[ -z "${DEFAULT_ACCOUNT_PASS}" ] && echo "You must have DEFAULT_ACCOUNT_PASS set in your environment" && exit 1
[ -z "${DEPLOYING_COLOR}" ] && echo "You must have DEPLOYING_COLOR set in your environment" && exit 1
[ -z "${DISABLE_EMAILS}" ] && echo "You must have DISABLE_EMAILS set in your environment" && exit 1
[ -z "${EFCMS_DOMAIN}" ] && echo "You must have EFCMS_DOMAIN set in your environment" && exit 1
[ -z "${ENABLE_HEALTH_CHECKS}" ] && echo "You must have ENABLE_HEALTH_CHECKS set in your environment" && exit 1
[ -z "${ENV}" ] && echo "You must have ENV set in your environment" && exit 1
[ -z "${IRS_SUPERUSER_EMAIL}" ] && echo "You must have IRS_SUPERUSER_EMAIL set in your environment" && exit 1
[ -z "${MIGRATE_FLAG}" ] && echo "You must have MIGRATE_FLAG set in your environment" && exit 1
[ -z "${ZONE_NAME}" ] && echo "You must have ZONE_NAME set in your environment" && exit 1
[ -z "${COLOR}" ] && echo "You must have COLOR set in your environment" && exit 1

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
echo "  - ENABLE_HEALTH_CHECKS=${ENABLE_HEALTH_CHECKS}"
echo "  - ENV=${ENV}"
echo "  - IRS_SUPERUSER_EMAIL=${IRS_SUPERUSER_EMAIL}"
echo "  - LOWER_ENV_ACCOUNT_ID=${LOWER_ENV_ACCOUNT_ID}"
echo "  - MIGRATE_FLAG=${MIGRATE_FLAG}"
echo "  - PROD_ENV_ACCOUNT_ID=${PROD_ENV_ACCOUNT_ID}"
echo "  - ZONE_NAME=${ZONE_NAME}"
echo "  - ZONE_NAME=${COLOR}"

../../../../scripts/verify-terraform-version.sh

BUCKET="${ZONE_NAME}.terraform.deploys"
ALL_COLORS_KEY="documents-${ENV}.tfstate"
KEY="documents-${ENV}-${COLOR}.tfstate"
LOCK_TABLE=efcms-terraform-lock

rm -rf .terraform

echo "Initiating provisioning for environment [${ENV}] in AWS region [${REGION}]"
sh ../../bin/create-bucket.sh "${BUCKET}" "${KEY}" "${REGION}"

echo "checking for the dynamodb lock table..."
aws dynamodb list-tables --output json --region "${REGION}" --query "contains(TableNames, '${LOCK_TABLE}')" | grep 'true'
result=$?
if [ ${result} -ne 0 ]; then
  echo "dynamodb lock does not exist, creating"
  sh ../../bin/create-dynamodb.sh "${LOCK_TABLE}" "${REGION}"
else
  echo "dynamodb lock table already exists"
fi

npm run build:assets

# exit on any failure
set -eo pipefail

if [ -z "${CIRCLE_BRANCH}" ]; then
  pushd ../../../runtimes/puppeteer/
  sh build-local.sh
  popd
fi

if [ "${MIGRATE_FLAG}" == 'false' ]; then
  BLUE_TABLE_NAME=$(../../../../scripts/dynamo/get-destination-table.sh "${ENV}")
  GREEN_TABLE_NAME=$(../../../../scripts/dynamo/get-destination-table.sh "${ENV}")
  DESTINATION_DOMAIN=$(../../../../scripts/elasticsearch/get-destination-elasticsearch.sh "${ENV}")
  BLUE_ELASTICSEARCH_DOMAIN="${DESTINATION_DOMAIN}"
  GREEN_ELASTICSEARCH_DOMAIN="${DESTINATION_DOMAIN}"
else
  if [ "${DEPLOYING_COLOR}" == 'blue' ]; then
    BLUE_TABLE_NAME=$(../../../../scripts/dynamo/get-destination-table.sh "${ENV}")
    GREEN_TABLE_NAME=$(../../../../scripts/dynamo/get-source-table.sh "${ENV}")
    BLUE_ELASTICSEARCH_DOMAIN=$(../../../../scripts/elasticsearch/get-destination-elasticsearch.sh "${ENV}")
    GREEN_ELASTICSEARCH_DOMAIN=$(../../../../scripts/elasticsearch/get-source-elasticsearch.sh "${ENV}")
  else
    GREEN_TABLE_NAME=$(../../../../scripts/dynamo/get-destination-table.sh "${ENV}")
    BLUE_TABLE_NAME=$(../../../../scripts/dynamo/get-source-table.sh "${ENV}")
    GREEN_ELASTICSEARCH_DOMAIN=$(../../../../scripts/elasticsearch/get-destination-elasticsearch.sh "${ENV}")
    BLUE_ELASTICSEARCH_DOMAIN=$(../../../../scripts/elasticsearch/get-source-elasticsearch.sh "${ENV}")
  fi
fi

if [[ -z "${DYNAMSOFT_URL_OVERRIDE}" ]]; then
  SCANNER_RESOURCE_URI="https://dynamsoft-lib.${EFCMS_DOMAIN}/Dynamic%20Web%20TWAIN%20SDK%2017.2.5/Resources"
else
  SCANNER_RESOURCE_URI="${DYNAMSOFT_URL_OVERRIDE}/Dynamic%20Web%20TWAIN%20SDK%2017.2.5/Resources"
fi

DEPLOYMENT_TIMESTAMP=$(date "+%s")

export TF_VAR_all_colors_tfstate_bucket=$BUCKET
export TF_VAR_all_colors_tfstate_key=$ALL_COLORS_KEY
export TF_VAR_environment=$ENV
export TF_VAR_zone_name=$ZONE_NAME
export TF_VAR_blue_table_name=$BLUE_TABLE_NAME
export TF_VAR_dns_domain=$EFCMS_DOMAIN
export TF_VAR_blue_elasticsearch_domain=$BLUE_ELASTICSEARCH_DOMAIN
export TF_VAR_enable_health_checks=$ENABLE_HEALTH_CHECKS
export TF_VAR_prod_env_account_id=$PROD_ENV_ACCOUNT_ID
export TF_VAR_deployment_timestamp=$DEPLOYMENT_TIMESTAMP
export TF_VAR_lower_env_account_id=$LOWER_ENV_ACCOUNT_ID
export TF_VAR_bounce_alert_recipients=$BOUNCE_ALERT_RECIPIENTS
export TF_VAR_bounced_email_recipient=$BOUNCED_EMAIL_RECIPIENT
export TF_VAR_cognito_suffix=$COGNITO_SUFFIX
export TF_VAR_default_account_pass=$DEFAULT_ACCOUNT_PASS
export TF_VAR_disable_emails=$DISABLE_EMAILS
export TF_VAR_irs_superuser_email=$IRS_SUPERUSER_EMAIL
export TF_VAR_scanner_resource_uri=$SCANNER_RESOURCE_URI
export TF_VAR_slack_webhook_url=$SLACK_WEBHOOK_URL
export TF_VAR_green_elasticsearch_domain=$GREEN_ELASTICSEARCH_DOMAIN
export TF_VAR_green_table_name=$GREEN_TABLE_NAME

terraform init -upgrade -backend=true -backend-config=bucket="${BUCKET}" -backend-config=key="${KEY}" -backend-config=dynamodb_table="${LOCK_TABLE}" -backend-config=region="${REGION}"
terraform plan -out execution-plan
terraform apply -auto-approve execution-plan
