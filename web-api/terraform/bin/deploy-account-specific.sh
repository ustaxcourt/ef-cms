#!/bin/bash

export ENV="account"
export REGION="us-east-1"
pushd ../../../../
# shellcheck disable=SC1091
. ./scripts/load-environment-from-secrets.sh
popd || exit

[ -z "${COGNITO_SUFFIX}" ] && echo "You must set COGNITO_SUFFIX as an environment variable" && exit 1
[ -z "${EFCMS_DOMAIN}" ] && echo "You must set EFCMS_DOMAIN as an environment variable" && exit 1
[ -z "${ES_LOGS_EBS_VOLUME_SIZE_GB}" ] && echo "You must set ES_LOGS_EBS_VOLUME_SIZE_GB as an environment variable" && exit 1
[ -z "${ES_LOGS_INSTANCE_COUNT}" ] && echo "You must set ES_LOGS_INSTANCE_COUNT as an environment variable" && exit 1
[ -z "${ES_LOGS_INSTANCE_TYPE}" ] && echo "You must set ES_LOGS_INSTANCE_TYPE as an environment variable" && exit 1
[ -z "${LOG_SNAPSHOT_BUCKET_NAME}" ] && echo "You must set LOG_SNAPSHOT_BUCKET_NAME as an environment variable" && exit 1
[ -z "${NUM_DAYS_TO_KEEP_LOGS}" ] && echo "You must set NUM_DAYS_TO_KEEP_LOGS as an environment variable" && exit 1
[ -z "${ES_LOGS_ENGINE_VERSION}" ] && echo "You must set ES_LOGS_ENGINE_VERSION as an environment variable" && exit 1

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

export TF_VAR_my_s3_state_bucket="${BUCKET}"
export TF_VAR_my_s3_state_key="${KEY}"
export TF_VAR_dns_domain=$EFCMS_DOMAIN
export TF_VAR_zone_name=$DNS_DOMAIN
export TF_VAR_es_logs_instance_count="${ES_LOGS_INSTANCE_COUNT}"
export TF_VAR_es_logs_instance_type="${ES_LOGS_INSTANCE_TYPE}"
export TF_VAR_es_logs_ebs_volume_size_gb="${ES_LOGS_EBS_VOLUME_SIZE_GB}"
export TF_VAR_cognito_suffix="${COGNITO_SUFFIX}"
export TF_VAR_number_of_days_to_keep_info_logs="${NUM_DAYS_TO_KEEP_LOGS}"
if [ -n "${LOG_GROUP_ENVIRONMENTS}" ]; then
  export TF_VAR_log_group_environments="${LOG_GROUP_ENVIRONMENTS}"
fi
export TF_VAR_dawson_dev_trusted_role_arns="${DAWSON_DEV_TRUSTED_ROLE_ARNS}"
export TF_VAR_log_snapshot_bucket_name="${LOG_SNAPSHOT_BUCKET_NAME}"
export TF_VAR_lower_env_restore_roles="[\"arn:aws:iam::${LOWER_ENV_ACCOUNT_IDS//,/:role/restore_role_*\",\"arn:aws:iam::}:role/restore_role_*\"]"
export TF_VAR_es_logs_engine_version="$ES_LOGS_ENGINE_VERSION"
export TF_VAR_es_info_cluster_create="${ES_INFO_CLUSTER_CREATE:-true}"
export TF_VAR_es_info_cluster_arn="${ES_INFO_CLUSTER_ARN}"
export TF_VAR_es_info_cluster_lower_environment_account_ids="${ES_INFO_CLUSTER_LOWER_ENVIRONMENT_ACCOUNT_IDS:-}"
export TF_VAR_es_info_cluster_endpoint="${ES_INFO_CLUSTER_ENDPOINT:-}"

npm run build:assets

terraform init -upgrade -backend=true \
 -backend-config=bucket="$BUCKET" \
 -backend-config=key="$KEY" \
 -backend-config=dynamodb_table="$LOCK_TABLE" \
 -backend-config=region="$REGION"
terraform apply

# ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

#terraform import "module.ci-cd.aws_ecr_repository.image_repository" "ef-cms-us-east-1"
#terraform import "module.dawson-developer-permissions.aws_iam_role.dawson_dev" "dawson_dev"
#terraform import "module.edge-lambda-permissions.aws_iam_service_linked_role.lambda_cloudfront_logger_role" "arn:aws:iam::${ACCOUNT_ID}:role/aws-service-role/logger.cloudfront.amazonaws.com/AWSServiceRoleForCloudFrontLogger"
#terraform import "module.email-monitoring.aws_ses_receipt_rule_set.email_forwarding_rule_set" "email_forwarding_rule_set"
#terraform import "module.kibana.aws_iam_policy.log_viewers_auth" "arn:aws:iam::${ACCOUNT_ID}:policy/log_viewers_auth_policy"
#terraform import "module.kibana.module.logs_to_es.aws_lambda_function.lambda_function" "LogsToElasticSearch_info"
#terraform import "module.edge-lambda-permissions.aws_iam_service_linked_role.lambda_replication_role" "arn:aws:iam::${ACCOUNT_ID}:role/aws-service-role/replicator.lambda.amazonaws.com/AWSServiceRoleForLambdaReplicator"
#terraform import "module.kibana.aws_cloudwatch_log_group.logs_to_elasticsearch" "/aws/lambda/LogsToElasticSearch_info"
#terraform import "module.kibana.aws_lambda_permission.allow_cloudwatch" "LogsToElasticSearch_info/AllowExecutionFromCloudWatch"

# NOTE: The following imports are for resources that only exist when ES_INFO_CLUSTER_CREATE=true
#terraform import "module.kibana.aws_cloudwatch_event_rule.every_day[0]" "daily-job"
#terraform import "module.kibana.aws_s3_bucket.ustc_log_snapshots_bucket[0]" "efcms-exp6-log-snapshots"
#terraform import "module.kibana.opensearch_snapshot_repository.archived-logs[0]" "archived-logs"