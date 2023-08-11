#!/bin/bash -e

# Getting the account-wide deployment settings and injecting them into the shell environment
TEMP_ENV=${ENV}
export ENV=account
pushd ../../../../
# shellcheck disable=SC1091
. ./scripts/load-environment-from-secrets.sh
popd
export ENV=${TEMP_ENV}

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

if [ -z "$NUM_DAYS_TO_KEEP_LOGS" ]; then
  echo "Please export the NUM_DAYS_TO_KEEP_LOGS variable in your shell"
  exit 1
fi

../../../../scripts/verify-terraform-version.sh

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

npm run build:lambda:rotate-info-indices

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

terraform init -backend=true -backend-config=bucket="${BUCKET}" -backend-config=key="${KEY}" -backend-config=dynamodb_table="${LOCK_TABLE}" -backend-config=region="${REGION}"
