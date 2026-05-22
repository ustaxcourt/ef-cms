#!/usr/bin/env bash

export ENV="account"
export REGION="us-east-1"
pushd ../../../../
# shellcheck disable=SC1091
. ./scripts/load-environment-from-secrets.sh
popd || exit

[[ -z "$COGNITO_SUFFIX" ]] && echo "You must set COGNITO_SUFFIX as an environment variable" && exit 1
[[ -z "$COGNITO_USER_POOL" ]] && echo "You must set COGNITO_USER_POOL as an environment variable" && exit 1
[[ -z "$EFCMS_DOMAIN" ]] && echo "You must set EFCMS_DOMAIN as an environment variable" && exit 1
[[ -z "$ES_LOGS_CLUSTER_ARN" ]] && [[ -n "$ES_LOGS_ENDPOINT" ]] && echo "You must set ES_LOGS_CLUSTER_ARN as an environment variable" && exit 1
[[ -z "$ES_LOGS_ENDPOINT" ]] && [[ -n "$ES_LOGS_CLUSTER_ARN" ]] && echo "You must set ES_LOGS_ENDPOINT as an environment variable" && exit 1
[[ -z "$ES_LOGS_INSTANCE_COUNT" ]] && echo "You must set ES_LOGS_INSTANCE_COUNT as an environment variable" && exit 1

if [[ "$ES_LOGS_INSTANCE_COUNT" -gt 0 ]]; then
  [[ -z "$ES_LOGS_EBS_VOLUME_SIZE_GB" ]] && echo "You must set ES_LOGS_EBS_VOLUME_SIZE_GB as an environment variable" && exit 1
  [[ -z "$ES_LOGS_ENGINE_VERSION" ]] && echo "You must set ES_LOGS_ENGINE_VERSION as an environment variable" && exit 1
  [[ -z "$ES_LOGS_INSTANCE_TYPE" ]] && echo "You must set ES_LOGS_INSTANCE_TYPE as an environment variable" && exit 1
  [[ -z "$LOG_SNAPSHOT_BUCKET_NAME" ]] && echo "You must set LOG_SNAPSHOT_BUCKET_NAME as an environment variable" && exit 1
  [[ -z "$NUM_DAYS_TO_KEEP_LOGS" ]] && echo "You must set NUM_DAYS_TO_KEEP_LOGS as an environment variable" && exit 1
else
  [[ -z "$ES_LOGS_EBS_VOLUME_SIZE_GB" ]] && ES_LOGS_EBS_VOLUME_SIZE_GB=0
  [[ -z "$NUM_DAYS_TO_KEEP_LOGS" ]] && NUM_DAYS_TO_KEEP_LOGS=0
fi

../../../../scripts/verify-terraform-version.sh

BUCKET="${EFCMS_DOMAIN}.terraform.deploys"
KEY="permissions-${ENV}.tfstate"
LOCK_TABLE=efcms-terraform-lock
REGION=us-east-1

# ZONE_NAME is deprecated and will only be set in legacy accounts
DNS_DOMAIN="$EFCMS_DOMAIN"
if [[ -n "$ZONE_NAME" ]]; then
  BUCKET="${ZONE_NAME}.terraform.deploys"
  DNS_DOMAIN="$ZONE_NAME"
fi

LOWER_ENV_ACCOUNT_IDS=$(aws sts get-caller-identity --query Account --output text)
[[ -n "$PRODLIKE_LOWER_ENV_ACCOUNT_IDS" ]] && LOWER_ENV_ACCOUNT_IDS="$PRODLIKE_LOWER_ENV_ACCOUNT_IDS"

rm -rf .terraform
rm -f .terraform.lock.hcl

echo "Initiating provisioning for environment [${ENV}] in AWS region [${REGION}]"
sh ../../bin/create-bucket.sh "$BUCKET" "$KEY" "$REGION"

echo "checking for the dynamodb lock table..."
aws dynamodb list-tables --output json --region "$REGION" --query "contains(TableNames, '${LOCK_TABLE}')" | grep 'true'
result=$?
if [ "$result" -ne 0 ]; then
  echo "dynamodb lock does not exist, creating"
  sh ../../bin/create-dynamodb.sh "$LOCK_TABLE" "$REGION"
else
  echo "dynamodb lock table already exists"
fi

export TF_VAR_my_s3_state_bucket="$BUCKET"
export TF_VAR_my_s3_state_key="$KEY"

export TF_VAR_cognito_suffix="$COGNITO_SUFFIX"
export TF_VAR_cognito_user_pool="$COGNITO_USER_POOL"
export TF_VAR_dawson_dev_trusted_role_arns="$DAWSON_DEV_TRUSTED_ROLE_ARNS"
export TF_VAR_dns_domain="$EFCMS_DOMAIN"
export TF_VAR_es_logs_cluster_arn="$ES_LOGS_CLUSTER_ARN"
[[ -n "$ES_LOGS_CONSUMER_ACCOUNT_IDS" ]] && export TF_VAR_es_logs_consumer_account_ids="$ES_LOGS_CONSUMER_ACCOUNT_IDS"
export TF_VAR_es_logs_ebs_volume_size_gb="$ES_LOGS_EBS_VOLUME_SIZE_GB"
export TF_VAR_es_logs_endpoint="$ES_LOGS_ENDPOINT"
export TF_VAR_es_logs_engine_version="$ES_LOGS_ENGINE_VERSION"
export TF_VAR_es_logs_instance_count="$ES_LOGS_INSTANCE_COUNT"
export TF_VAR_es_logs_instance_type="$ES_LOGS_INSTANCE_TYPE"
[[ -n "$LOG_GROUP_ENVIRONMENTS" ]] && export TF_VAR_log_group_environments="$LOG_GROUP_ENVIRONMENTS"
export TF_VAR_log_snapshot_bucket_name="$LOG_SNAPSHOT_BUCKET_NAME"
export TF_VAR_lower_env_restore_roles="[\"arn:aws:iam::${LOWER_ENV_ACCOUNT_IDS//,/:role/restore_role_*\",\"arn:aws:iam::}:role/restore_role_*\"]"
export TF_VAR_number_of_days_to_keep_info_logs="$NUM_DAYS_TO_KEEP_LOGS"
export TF_VAR_zendesk_aws_account_id="$ZENDESK_AWS_ACCOUNT_ID"
export TF_VAR_zone_name="$DNS_DOMAIN"

npm run build:assets

terraform init -upgrade -backend=true \
 -backend-config=bucket="$BUCKET" \
 -backend-config=key="$KEY" \
 -backend-config=dynamodb_table="$LOCK_TABLE" \
 -backend-config=region="$REGION"
 
if [[ "$ES_LOGS_INSTANCE_COUNT" -eq 0 ]]; then
  terraform state rm 'module.kibana.opensearch_snapshot_repository.archived-logs' 2>/dev/null && echo "Removed OpenSearch snapshot repository from state" || echo "OpenSearch snapshot repository not in state"
  terraform state rm 'module.kibana.aws_cloudwatch_event_target.rotate_info_indices_daily' 2>/dev/null && echo "Removed EventBridge target from state" || echo "EventBridge target not in state"
  terraform state rm 'module.kibana.aws_cloudwatch_event_rule.every_day' 2>/dev/null && echo "Removed EventBridge rule from state" || echo "EventBridge rule not in state"
  [[ -n "$LOG_SNAPSHOT_BUCKET_NAME" ]] && aws s3 rm "s3://${LOG_SNAPSHOT_BUCKET_NAME}" --recursive
fi

terraform apply
