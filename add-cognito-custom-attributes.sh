#!/bin/bash -e

#
# This is a temporary script used to add the custom attribute `userId` to our cognito
# user pools without deleting and recreating them. 
#
# Arguments
#   - $1 - the environment [dev, stg, prod, exp1, exp1, etc]

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

REGION="us-east-1"

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

USER_POOL_ID=$(aws cognito-idp list-user-pools --query "UserPools[?Name == 'efcms-${ENVIRONMENT}'].Id | [0]" --max-results 30 --region "${REGION}" --output text)

aws cognito-idp --region "${REGION}" add-custom-attributes --user-pool-id "${USER_POOL_ID}" --custom-attributes Name="userId",AttributeDataType=String,Mutable=true,Required=false,StringAttributeConstraints="{MinLength=0,MaxLength=255}"

export TF_VAR_dns_domain=$EFCMS_DOMAIN
export TF_VAR_zone_name=$ZONE_NAME
export TF_VAR_environment=$ENVIRONMENT
export TF_VAR_cognito_suffix=$COGNITO_SUFFIX
export TF_VAR_email_dmarc_policy=$EMAIL_DMARC_POLICY
export TF_VAR_es_instance_count=$ES_INSTANCE_COUNT
export TF_VAR_es_instance_type=$ES_INSTANCE_TYPE
export TF_VAR_honeybadger_key=$CIRCLE_HONEYBADGER_API_KEY
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

npm run init:api -- "${ENVIRONMENT}"

pushd web-api/terraform/main
  terraform state rm module.ef-cms_apis.aws_cognito_user_pool.pool
  terraform import module.ef-cms_apis.aws_cognito_user_pool.pool "${USER_POOL_ID}"
popd