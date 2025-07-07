#!/bin/bash -e

# shellcheck disable=SC1091
ENVIRONMENT=$1

[ -z "${ENVIRONMENT}" ] && echo "You must pass in the environment as an argument to the script" && exit 1
[ -z "${EFCMS_DOMAIN}" ] && echo "You must have EFCMS_DOMAIN set in your environment" && exit 1

echo "Running terraform with the following environment configs:"
echo "  - EFCMS_DOMAIN=${EFCMS_DOMAIN}"
echo "  - ENVIRONMENT=${ENVIRONMENT}"
echo "  - PROD_ENV_ACCOUNT_ID=${PROD_ENV_ACCOUNT_ID}"

BUCKET="${EFCMS_DOMAIN}.terraform.deploys"
KEY="glue-role-${ENVIRONMENT}.tfstate"
LOCK_TABLE=efcms-terraform-lock
REGION=us-east-1

export TF_VAR_remote_account_number=$PROD_ENV_ACCOUNT_ID

rm -rf .terraform
rm .terraform.lock.hcl

terraform init -backend=true \
 -backend-config=bucket="${BUCKET}" \
 -backend-config=key="${KEY}" \
 -backend-config=dynamodb_table="${LOCK_TABLE}" \
 -backend-config=region="${REGION}"
terraform plan
terraform apply -auto-approve
