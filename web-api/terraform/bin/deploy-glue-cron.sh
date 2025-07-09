#!/bin/bash -e

# shellcheck disable=SC1091
ENVIRONMENT=$1

[ -z "${ENVIRONMENT}" ] && echo "You must pass in ENVIRONMENT as command line argument 1" && exit 1
[ -z "$EFCMS_DOMAIN" ] && echo "You must have EFCMS_DOMAIN set in your environment" && exit 1

echo "Running terraform with the following environment configs:"
echo "  - EFCMS_DOMAIN=${EFCMS_DOMAIN}"
echo "  - ENVIRONMENT=${ENVIRONMENT}"

export ENVIRONMENT="${ENVIRONMENT}"
export TF_VAR_circle_machine_user_token=$CIRCLE_MACHINE_USER_TOKEN
export TF_VAR_circle_workflow_id=$CIRCLE_WORKFLOW_ID
export TF_VAR_environment=$ENVIRONMENT

../../../../scripts/verify-terraform-version.sh

BUCKET="${EFCMS_DOMAIN}.terraform.deploys"
[ -z "$TERRAFORM_BUCKET" ] && BUCKET="$TERRAFORM_BUCKET"
KEY="glue-cron-${ENVIRONMENT}.tfstate"
LOCK_TABLE=efcms-terraform-lock
REGION=us-east-1

rm -rf .terraform
rm -f .terraform.lock.hcl

npm run build:assets

terraform init -upgrade -backend=true \
 -backend-config=bucket="$BUCKET" \
 -backend-config=key="$KEY" \
 -backend-config=dynamodb_table="$LOCK_TABLE" \
 -backend-config=region="$REGION"
terraform plan
terraform apply -auto-approve
