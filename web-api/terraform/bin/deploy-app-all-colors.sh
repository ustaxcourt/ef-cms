#!/bin/bash -e

ENV=$1

MIGRATE_FLAG=$(../../../../scripts/dynamo/get-migrate-flag.sh "${ENV}")

export MIGRATE_FLAG

# Getting the environment-specific deployment settings and injecting them into the shell environment
if [ -z "${SECRETS_LOADED}" ]; then
  pushd ../../../../
  # shellcheck disable=SC1091
  . ./scripts/load-environment-from-secrets.sh
  popd
fi

[ -z "${COGNITO_SUFFIX}" ] && echo "You must have COGNITO_SUFFIX set in your environment" && exit 1
[ -z "${EFCMS_DOMAIN}" ] && echo "You must have EFCMS_DOMAIN set in your environment" && exit 1
[ -z "${EMAIL_DMARC_POLICY}" ] && echo "You must have EMAIL_DMARC_POLICY set in your environment" && exit 1
[ -z "${ENABLE_HEALTH_CHECKS}" ] && echo "You must have ENABLE_HEALTH_CHECKS set in your environment" && exit 1
[ -z "${ENV}" ] && echo "You must have ENV set in your environment" && exit 1
[ -z "${ES_INSTANCE_TYPE}" ] && echo "You must have ES_INSTANCE_TYPE set in your environment" && exit 1
[ -z "${ES_VOLUME_SIZE}" ] && echo "You must have ES_VOLUME_SIZE set in your environment" && exit 1
[ -z "${MIGRATE_FLAG}" ] && echo "You must have MIGRATE_FLAG set in your environment" && exit 1
[ -z "${ZONE_NAME}" ] && echo "You must have ZONE_NAME set in your environment" && exit 1

echo "Running terraform with the following environment configs:"
echo "  - SLACK_WEBHOOK_URL=${SLACK_WEBHOOK_URL}"
echo "  - CIRCLE_BRANCH=${CIRCLE_BRANCH}"
echo "  - COGNITO_SUFFIX=${COGNITO_SUFFIX}"
echo "  - EFCMS_DOMAIN=${EFCMS_DOMAIN}"
echo "  - EMAIL_DMARC_POLICY=${EMAIL_DMARC_POLICY}"
echo "  - ENABLE_HEALTH_CHECKS=${ENABLE_HEALTH_CHECKS}"
echo "  - ENV=${ENV}"
echo "  - ES_INSTANCE_TYPE=${ES_INSTANCE_TYPE}"
echo "  - ES_VOLUME_SIZE=${ES_VOLUME_SIZE}"
echo "  - LOWER_ENV_ACCOUNT_ID=${LOWER_ENV_ACCOUNT_ID}"
echo "  - MIGRATE_FLAG=${MIGRATE_FLAG}"
echo "  - PROD_ENV_ACCOUNT_ID=${PROD_ENV_ACCOUNT_ID}"
echo "  - ZONE_NAME=${ZONE_NAME}"

../../../../scripts/verify-terraform-version.sh

BUCKET="${ZONE_NAME}.terraform.deploys"
KEY="documents-${ENV}.tfstate"
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

# exit on any failure
set -eo pipefail

if [ "${MIGRATE_FLAG}" == 'false' ]; then
  DESTINATION_DOMAIN=$(../../../../scripts/elasticsearch/get-destination-elasticsearch.sh "${ENV}")

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
fi

ACTIVE_SES_RULESET=$(../../../../scripts/ses/get-ses-ruleset.sh)

export TF_VAR_environment=$ENV
export TF_VAR_dns_domain=$EFCMS_DOMAIN
export TF_VAR_zone_name=$ZONE_NAME
export TF_VAR_active_ses_ruleset=$ACTIVE_SES_RULESET
export TF_VAR_cognito_suffix=$COGNITO_SUFFIX
export TF_VAR_email_dmarc_policy=$EMAIL_DMARC_POLICY
export TF_VAR_enable_health_checks=$ENABLE_HEALTH_CHECKS
export TF_VAR_es_instance_count=$ES_INSTANCE_COUNT
export TF_VAR_es_instance_type=$ES_INSTANCE_TYPE
export TF_VAR_es_volume_size=$ES_VOLUME_SIZE
export TF_VAR_lower_env_account_id=$LOWER_ENV_ACCOUNT_ID
export TF_VAR_prod_env_account_id=$PROD_ENV_ACCOUNT_ID
export TF_VAR_should_es_alpha_exist=$SHOULD_ES_ALPHA_EXIST
export TF_VAR_should_es_beta_exist=$SHOULD_ES_BETA_EXIST

terraform init -backend=true -backend-config=bucket="${BUCKET}" -backend-config=key="${KEY}" -backend-config=dynamodb_table="${LOCK_TABLE}" -backend-config=region="${REGION}"
terraform plan -out execution-plan
terraform apply -auto-approve execution-plan
