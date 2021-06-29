#!/bin/bash

# This script is temporary, and can be removed once all environments (Court, Flexion)
# have their Public API stages imported.

ENV=$1
[ -z "${ENV}" ] && echo "Pass the environment name as the first argument" && exit 1

tf_version=$(terraform --version)

if [[ ${tf_version} != *"1.0.0"* ]]; then
  echo "Please set your terraform version to 1.0.0 before deploying."
  exit 1
fi

echo "Determining environment variables…"
echo

# Ensure we’re in the web-api/terraform/main directory
cd $(cd -P -- "$(dirname -- "$0")" && pwd -P)
cd ../main

export AWS_PAGER="" # Don’t show `less` on AWS CLI responses

MIGRATE_FLAG=$(aws dynamodb get-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --key '{"pk":{"S":"migrate"},"sk":{"S":"migrate"}}' | jq -r ".Item.current.S")
[ -z "$MIGRATE_FLAG" ] && MIGRATE_FLAG="false"

CURRENT_COLOR=$(aws dynamodb get-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --key '{"pk":{"S":"current-color"},"sk":{"S":"current-color"}}' | jq -r ".Item.current.S")
[ -z "$CURRENT_COLOR" ] && CURRENT_COLOR="green"

if  [[ $CURRENT_COLOR == "green" ]] ; then
  DEPLOYING_COLOR="blue"
else
  DEPLOYING_COLOR="green"
fi

DESTINATION_TABLE=$(../../../get-destination-elasticsearch.sh $ENV)

if [ "${MIGRATE_FLAG}" == 'false' ]; then
  BLUE_TABLE_NAME=$(../../../scripts/get-destination-table.sh $ENV)
  GREEN_TABLE_NAME=$(../../../scripts/get-destination-table.sh $ENV)
  BLUE_ELASTICSEARCH_DOMAIN=$(../../../scripts/get-destination-elasticsearch.sh $ENV)
  GREEN_ELASTICSEARCH_DOMAIN=$(../../../scripts/get-destination-elasticsearch.sh $ENV)
else
  if [ "${DEPLOYING_COLOR}" == 'blue' ]; then
    BLUE_TABLE_NAME=$(../../../scripts/get-destination-table.sh $ENV)
    GREEN_TABLE_NAME=$(../../../scripts/get-source-table.sh $ENV)
    BLUE_ELASTICSEARCH_DOMAIN=$(../../../scripts/get-destination-elasticsearch.sh $ENV)
    GREEN_ELASTICSEARCH_DOMAIN=$(../../../scripts/get-source-elasticsearch.sh $ENV)
  else
    GREEN_TABLE_NAME=$(../../../scripts/get-destination-table.sh $ENV)
    BLUE_TABLE_NAME=$(../../../scripts/get-source-table.sh $ENV)
    GREEN_ELASTICSEARCH_DOMAIN=$(../../../scripts/get-destination-elasticsearch.sh $ENV)
    BLUE_ELASTICSEARCH_DOMAIN=$(../../../scripts/get-source-elasticsearch.sh $ENV)
  fi
fi

[ -z "$DISABLE_EMAILS" ] && DISABLE_EMAILS="true"

if [[ -z "${DYNAMSOFT_URL_OVERRIDE}" ]]; then
  SCANNER_RESOURCE_URI="https://dynamsoft-lib.${EFCMS_DOMAIN}/dynamic-web-twain-sdk-14.3.1"
else
  SCANNER_RESOURCE_URI="${DYNAMSOFT_URL_OVERRIDE}/dynamic-web-twain-sdk-14.3.1"
fi

[ -z "$BRANCH" ] && BRANCH=$(git rev-parse --abbrev-ref HEAD)

ES_INSTANCE_COUNT=$(../../../scripts/get-es-instance-count.sh $BRANCH)
ES_INSTANCE_TYPE=$(../../../scripts/get-es-instance-type.sh $BRANCH)
ES_VOLUME_SIZE=$(../../../scripts/get-es-volume-size.sh $BRANCH)

SNS_TOPIC_ARN=$(aws sns list-topics --region="us-east-1" --query "Topics[?contains(TopicArn, 'system_health_alarms')].TopicArn" --output=text)

# Prompt to ensure proper configuration
echo Current configuration:
echo
echo "  - ENV=${ENV}"
echo "  - MIGRATE_FLAG=${MIGRATE_FLAG}"
echo "  - DEPLOYING_COLOR=${DEPLOYING_COLOR}"
echo "  - ZONE_NAME=${ZONE_NAME}"
echo "  - EFCMS_DOMAIN=${EFCMS_DOMAIN}"
echo "  - COGNITO_SUFFIX=${COGNITO_SUFFIX}"
echo "  - EMAIL_DMARC_POLICY=${EMAIL_DMARC_POLICY}"
echo "  - IRS_SUPERUSER_EMAIL=${IRS_SUPERUSER_EMAIL}"
echo "  - DISABLE_EMAILS=${DISABLE_EMAILS}"
echo "  - ES_INSTANCE_TYPE=${ES_INSTANCE_TYPE}"
echo "  - ES_VOLUME_SIZE=${ES_VOLUME_SIZE}"
echo "  - ES_INSTANCE_COUNT=${ES_INSTANCE_COUNT}"
echo "  - BOUNCED_EMAIL_RECIPIENT=${BOUNCED_EMAIL_RECIPIENT}"
echo "  - CIRCLE_HONEYBADGER_API_KEY=${CIRCLE_HONEYBADGER_API_KEY}"
echo
echo
echo "Terraform has trouble with passing variables to external modules while"
echo "running the import command (see GitHub issue "
echo "https://github.com/hashicorp/terraform/issues/22721). To work around,"
echo "temporarily comment out the following module (which is not involved"
echo "in the import task):"
echo
echo "# In web-api/terraform/template/elasticsearch/elasticsearch.tf, comment:"
echo "module \"logs_alarms\" {"
echo "  …"
echo "}"
echo
echo "You can make this change now without restarting this script."
echo

read -p "Continue with importing? (y/N) " -r
[[ ! $REPLY =~ ^[Yy]$ ]] && echo "Exiting." && exit 1

export TF_VAR_dns_domain=$EFCMS_DOMAIN
export TF_VAR_zone_name=$ZONE_NAME
export TF_VAR_environment=$ENV
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
export TF_VAR_scanner_resource_uri=$SCANNER_RESOURCE_URI

echo
echo "Initializing Terraform for the ${ENV} environment…"
echo

../bin/deploy-init.sh $ENV

echo "Importing the Public API stages into Terraform state for Blue and Green environments in us-east-1 and us-west-1…"
echo

set -ex

for REGION in east west; do
  for COLOR in blue green; do
    API_ID=$(aws apigateway get-rest-apis --region="us-${REGION}-1" --query "items[?name=='gateway_api_public_${ENV}_${COLOR}'].id" --output text)
    terraform import module.ef-cms_apis.module.api-${REGION}-${COLOR}.aws_api_gateway_stage.api_public_stage ${API_ID}/${ENV}
  done
done
