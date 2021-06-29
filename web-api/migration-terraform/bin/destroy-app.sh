#!/bin/bash

ENVIRONMENT=$1

BUCKET="${ZONE_NAME}.terraform.deploys"
KEY="migrations-${ENVIRONMENT}.tfstate"
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
npm run build:lambda:migration

export TF_VAR_environment=$ENVIRONMENT
export TF_VAR_stream_arn=$STREAM_ARN
export TF_VAR_source_table=$SOURCE_TABLE
export TF_VAR_destination_table=$DESTINATION_TABLE

terraform init -backend=true -backend-config=bucket="${BUCKET}" -backend-config=key="${KEY}" -backend-config=dynamodb_table="${LOCK_TABLE}" -backend-config=region="${REGION}"
terraform plan
terraform destroy
