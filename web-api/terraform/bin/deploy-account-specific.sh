#!/bin/bash -e

export ENV="account"
pushd ../../../../
# shellcheck disable=SC1091
. ./scripts/load-environment-from-secrets.sh
popd

[ -z "${ZONE_NAME}" ] && echo "You must set ZONE_NAME as an environment variable" && exit 1
[ -z "${ES_LOGS_INSTANCE_COUNT}" ] && echo "You must set ES_LOGS_INSTANCE_COUNT as an environment variable" && exit 1
[ -z "${ES_LOGS_INSTANCE_TYPE}" ] && echo "You must set ES_LOGS_INSTANCE_TYPE as an environment variable" && exit 1
[ -z "${ES_LOGS_EBS_VOLUME_SIZE_GB}" ] && echo "You must set ES_LOGS_EBS_VOLUME_SIZE_GB as an environment variable" && exit 1
[ -z "${COGNITO_SUFFIX}" ] && echo "You must set COGNITO_SUFFIX as an environment variable" && exit 1
[ -z "${NUM_DAYS_TO_KEEP_LOGS}" ] && echo "You must set NUM_DAYS_TO_KEEP_LOGS as an environment variable" && exit 1
[ -z "${LOG_SNAPSHOT_BUCKET_NAME}" ] && echo "You must set LOG_SNAPSHOT_BUCKET_NAME as an environment variable" && exit 1

export TF_VAR_my_s3_state_bucket="${BUCKET}"
export TF_VAR_my_s3_state_key="${KEY}"
export TF_VAR_zone_name="${ZONE_NAME}"
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

../../../../scripts/verify-terraform-version.sh
 
npm run build:assets

terraform init -upgrade -backend=true \
 -backend-config=bucket="${ZONE_NAME}.terraform.deploys" \
 -backend-config=key="permissions-account.tfstate" \
 -backend-config=dynamodb_table="efcms-terraform-lock" \
 -backend-config=region="us-east-1"
terraform apply