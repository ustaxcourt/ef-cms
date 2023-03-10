#!/bin/bash

ENVIRONMENT=$1

export ENV="${ENVIRONMENT}"
export ENVIRONMENT

# Getting the environment-specific deployment settings and injecting them into the shell environment
if [ -z "${SECRETS_LOADED}" ]; then
  pushd ../../../../
  # shellcheck disable=SC1091
  . ./scripts/load-environment-from-secrets.sh
  popd || exit 1
fi

[ -z "${DEPLOYING_COLOR}" ] && echo "You must have ENABLE_HEALTH_CHECKS set in your environment" && exit 1
[ -z "${DESTINATION_ELASTICSEARCH}" ] && echo "You must have DYNAMSOFT_URL set in your environment" && exit 1
[ -z "${DESTINATION_TABLE}" ] && echo "You must have DESTINATION_TABLE set in your environment" && exit 1
[ -z "${SOURCE_TABLE}" ] && echo "You must have SOURCE_TABLE set in your environment" && exit 1

#TODO: remove unnecessary lines 
if [ "${MIGRATE_FLAG}" == 'false' ]; then
  BLUE_TABLE_NAME="${DESTINATION_TABLE}" 
  GREEN_TABLE_NAME="${DESTINATION_TABLE}"
  BLUE_ELASTICSEARCH_DOMAIN="${DESTINATION_ELASTICSEARCH}"
  GREEN_ELASTICSEARCH_DOMAIN="${DESTINATION_ELASTICSEARCH}"
  COGNITO_TRIGGER_TABLE_NAME="${DESTINATION_TABLE}"

  if [[ "${DESTINATION_ELASTICSEARCH}" == *'alpha'* ]]; then
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
    BLUE_TABLE_NAME="${DESTINATION_TABLE}"
    GREEN_TABLE_NAME="${SOURCE_TABLE}"
    BLUE_ELASTICSEARCH_DOMAIN="${DESTINATION_ELASTICSEARCH}"
    GREEN_ELASTICSEARCH_DOMAIN="${SOURCE_ELASTICSEARCH}"
    COGNITO_TRIGGER_TABLE_NAME="${SOURCE_TABLE}"
  else
    GREEN_TABLE_NAME="${DESTINATION_TABLE}"
    BLUE_TABLE_NAME="${SOURCE_TABLE}"
    GREEN_ELASTICSEARCH_DOMAIN="${DESTINATION_ELASTICSEARCH}"
    BLUE_ELASTICSEARCH_DOMAIN="${SOURCE_ELASTICSEARCH}"
    COGNITO_TRIGGER_TABLE_NAME="${SOURCE_TABLE}"
  fi
fi

if [[ -z "${DYNAMSOFT_URL_OVERRIDE}" ]]; then
  SCANNER_RESOURCE_URI="https://dynamsoft-lib.${EFCMS_DOMAIN}/Dynamic%20Web%20TWAIN%20SDK%2017.2.5/Resources"
else
  SCANNER_RESOURCE_URI="${DYNAMSOFT_URL_OVERRIDE}/Dynamic%20Web%20TWAIN%20SDK%2017.2.5/Resources"
fi

export TF_VAR_blue_elasticsearch_domain=$BLUE_ELASTICSEARCH_DOMAIN
export TF_VAR_blue_table_name=$BLUE_TABLE_NAME
export TF_VAR_bounce_alert_recipients=$BOUNCE_ALERT_RECIPIENTS
export TF_VAR_bounced_email_recipient=$BOUNCED_EMAIL_RECIPIENT
export TF_VAR_cognito_suffix=$COGNITO_SUFFIX
export TF_VAR_cognito_table_name=$COGNITO_TRIGGER_TABLE_NAME
export TF_VAR_deploying_color=$DEPLOYING_COLOR
export TF_VAR_destination_table=$DESTINATION_TABLE
export TF_VAR_disable_emails=$DISABLE_EMAILS
export TF_VAR_dns_domain=$EFCMS_DOMAIN
export TF_VAR_email_dmarc_policy=$EMAIL_DMARC_POLICY
export TF_VAR_environment=$ENV
export TF_VAR_es_instance_count=$ES_INSTANCE_COUNT
export TF_VAR_es_instance_type=$ES_INSTANCE_TYPE
export TF_VAR_es_volume_size=$ES_VOLUME_SIZE
export TF_VAR_green_elasticsearch_domain=$GREEN_ELASTICSEARCH_DOMAIN
export TF_VAR_green_table_name=$GREEN_TABLE_NAME
export TF_VAR_irs_superuser_email=$IRS_SUPERUSER_EMAIL
export TF_VAR_lower_env_account_id=$LOWER_ENV_ACCOUNT_ID
export TF_VAR_prod_env_account_id=$PROD_ENV_ACCOUNT_ID
export TF_VAR_scanner_resource_uri=$SCANNER_RESOURCE_URI
export TF_VAR_should_es_alpha_exist=$SHOULD_ES_ALPHA_EXIST
export TF_VAR_should_es_beta_exist=$SHOULD_ES_BETA_EXIST
export TF_VAR_slack_webhook_url=$SLACK_WEBHOOK_URL
export TF_VAR_zone_name=$ZONE_NAME

../../../../shared/terraform/bin/init.sh documents --build-api
