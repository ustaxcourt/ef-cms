#!/bin/bash

ENVIRONMENT=$1

[ -z "${ENVIRONMENT}" ] && echo "You must have ENVIRONMENT set in your environment" && exit 1
[ -z "${EFCMS_DOMAIN}" ] && echo "You must have EFCMS_DOMAIN set in your environment" && exit 1
[ -z "${ZONE_NAME}" ] && echo "You must have ZONE_NAME set in your environment" && exit 1

tf_version=$(terraform --version)
if [[ ${tf_version} != *"1.0.2"* ]]; then
  echo "Please set your terraform version to 1.0.2 before deploying."
  exit 1
fi

# Each $ENV will have its own terraform deploy bucket (i.e. "exp1.ustc-case-mgmt.flexion.us")
BUCKET="${ZONE_NAME}.terraform.deploys"
KEY="permissions-${ENVIRONMENT}.tfstate"
LOCK_TABLE=efcms-terraform-lock
REGION=us-east-1

if [[ ${ENVIRONMENT} == "prod" ]]; then
  if [[ ${EFCMS_DOMAIN} != *"dawson"* ]]; then
    echo "ENVIRONMENT and EFCMS_DOMAIN do not match. Please check your environment variables and run again."
    exit 1
  fi
elif [[ ${EFCMS_DOMAIN} != "${ENVIRONMENT}"* ]]; then
  echo "ENVIRONMENT and EFCMS_DOMAIN do not match. Please check your environment variables and run again."
  exit 1
fi

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

export TF_VAR_environment=$ENVIRONMENT
export TF_VAR_dns_domain=$EFCMS_DOMAIN

terraform init -backend=true -backend-config=bucket="${BUCKET}" -backend-config=key="${KEY}" -backend-config=dynamodb_table="${LOCK_TABLE}" -backend-config=region="${REGION}"
terraform apply -auto-approve
