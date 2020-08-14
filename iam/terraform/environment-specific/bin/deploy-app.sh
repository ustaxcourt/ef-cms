#!/bin/bash

ENVIRONMENT=$1

if [ -z "$ENVIRONMENT" ]; then
  echo "Please specify the environment"
  exit 1
fi

if [ -z "$EFCMS_DOMAIN" ]; then
  echo "Please export the EFCMS_DOMAIN variable in your shell"
  exit 1
fi

# Each $ENV will have its own terraform deploy bucket (i.e. "exp1.ustc-case-mgmt.flexion.us")
BUCKET="${ZONE_NAME}.terraform.deploys"
KEY="permissions-${ENVIRONMENT}.tfstate"
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

terraform init -backend=true -backend-config=bucket="${BUCKET}" -backend-config=key="${KEY}" -backend-config=dynamodb_table="${LOCK_TABLE}" -backend-config=region="${REGION}"
terraform apply -auto-approve -var "environment=${ENVIRONMENT}"
