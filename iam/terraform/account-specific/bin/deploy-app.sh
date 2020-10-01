#!/bin/bash

BUCKET="${ZONE_NAME}.terraform.deploys"
KEY="permissions-${ENVIRONMENT}.tfstate"
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

terraform init -backend=true -backend-config=bucket="${BUCKET}" -backend-config=key="${KEY}" -backend-config=dynamodb_table="${LOCK_TABLE}" -backend-config=region="${REGION}"
TF_VAR_my_s3_state_bucket="${BUCKET}"
TF_VAR_my_s3_state_key="${KEY}"
TF_VAR_dns_domain="${EFCMS_DOMAIN}"
TF_VAR_es_logs_instance_count="${ES_LOGS_INSTANCE_COUNT}"
TF_VAR_environments="${ENVIRONMENTS}"
terraform apply -auto-approve
