#!/bin/bash

if [ -z "$ZONE_NAME" ]; then
  echo "Please export the ZONE_NAME variable in your shell"
  exit 1
fi

if [ -z "$ES_LOGS_INSTANCE_COUNT" ]; then
  echo "Please export the ES_LOGS_INSTANCE_COUNT variable in your shell"
  exit 1
fi

if [ -z "$COGNITO_SUFFIX" ]; then
  echo "Please export the COGNITO_SUFFIX variable in your shell"
  exit 1
fi

BUCKET="${ZONE_NAME}.terraform.deploys"
KEY="permissions-account.tfstate"
LOCK_TABLE=efcms-terraform-lock
REGION=us-east-1

rm -rf .terraform
echo "Initiating provisioning for environment [${ENVIRONMENT}] in AWS region [${REGION}]"
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
export TF_VAR_cognito_suffix="${COGNITO_SUFFIX}"
# if [ -z "${LOG_GROUP_ENVIRONMENTS}" ]; then
#   export TF_VAR_log_group_environments="${LOG_GROUP_ENVIRONMENTS}"
# fi

terraform init -backend=true -backend-config=bucket="${BUCKET}" -backend-config=key="${KEY}" -backend-config=dynamodb_table="${LOCK_TABLE}" -backend-config=region="${REGION}"
