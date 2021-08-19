#!/bin/bash

if [ -z "$ZONE_NAME" ]; then
  echo "Please export the ZONE_NAME variable in your shell"
  exit 1
fi

if [ -z "$ES_LOGS_INSTANCE_COUNT" ]; then
  echo "Please export the ES_LOGS_INSTANCE_COUNT variable in your shell"
  exit 1
fi

if [ -z "$ES_LOGS_INSTANCE_TYPE" ]; then
  echo "Please export the ES_LOGS_INSTANCE_TYPE variable in your shell"
  exit 1
fi

if [ -z "$ES_LOGS_EBS_VOLUME_SIZE_GB" ]; then
  echo "Please export the ES_LOGS_EBS_VOLUME_SIZE_GB variable in your shell"
  exit 1
fi

if [ -z "$COGNITO_SUFFIX" ]; then
  echo "Please export the COGNITO_SUFFIX variable in your shell"
  exit 1
fi

tf_version=$(terraform --version)

if [[ ${tf_version} != *"1.0.2"* ]]; then
  echo "Please set your terraform version to 1.0.2 before deploying."
  exit 1
fi

BUCKET="${ZONE_NAME}.terraform.deploys"
KEY="permissions-account.tfstate"
LOCK_TABLE=efcms-terraform-lock
REGION=us-east-1

rm -rf .terraform
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

# exit on any failure
set -eo pipefail

export TF_VAR_my_s3_state_bucket="${BUCKET}"
export TF_VAR_my_s3_state_key="${KEY}"
export TF_VAR_zone_name="${ZONE_NAME}"
export TF_VAR_es_logs_instance_count="${ES_LOGS_INSTANCE_COUNT}"
export TF_VAR_es_logs_instance_type="${ES_LOGS_INSTANCE_TYPE}"
export TF_VAR_es_logs_ebs_volume_size_gb="${ES_LOGS_EBS_VOLUME_SIZE_GB}"
export TF_VAR_cognito_suffix="${COGNITO_SUFFIX}"
if [ -n "${LOG_GROUP_ENVIRONMENTS}" ]; then
  export TF_VAR_log_group_environments="${LOG_GROUP_ENVIRONMENTS}"
fi

echo $TF_VAR_log_group_environments="${LOG_GROUP_ENVIRONMENTS}"

terraform init -backend=true -backend-config=bucket="${BUCKET}" -backend-config=key="${KEY}" -backend-config=dynamodb_table="${LOCK_TABLE}" -backend-config=region="${REGION}"
terraform apply
