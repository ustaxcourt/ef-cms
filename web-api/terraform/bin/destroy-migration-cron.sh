#!/bin/bash -e

# shellcheck disable=SC1091
ENVIRONMENT=$1

[ -z "${ENVIRONMENT}" ] && echo "You must pass in ENVIRONMENT as command line argument 1" && exit 1
[ -z "${EFCMS_DOMAIN}" ] && echo "You must set EFCMS_DOMAIN as an environment variable" && exit 1
[ -z "${CIRCLE_MACHINE_USER_TOKEN}" ] && echo "You must set CIRCLE_MACHINE_USER_TOKEN as an environment variable" && exit 1
[ -z "${CIRCLE_WORKFLOW_ID}" ] && echo "You must set CIRCLE_WORKFLOW_ID as an environment variable" && exit 1
[ -z "${MIGRATE_FLAG}" ] && echo "You must set MIGRATE_FLAG as an environment variable" && exit 1

echo "Running terraform with the following environment configs:"
echo "  - ENVIRONMENT=${ENVIRONMENT}"
echo "  - EFCMS_DOMAIN=${EFCMS_DOMAIN}"

export TF_VAR_circle_machine_user_token=$CIRCLE_MACHINE_USER_TOKEN
export TF_VAR_circle_workflow_id=$CIRCLE_WORKFLOW_ID
export TF_VAR_environment=$ENVIRONMENT
export TF_VAR_migrate_flag=$MIGRATE_FLAG

../../../../scripts/verify-terraform-version.sh

BUCKET="${EFCMS_DOMAIN}.terraform.deploys"
[ -n "$TERRAFORM_BUCKET" ] && BUCKET="$TERRAFORM_BUCKET"
KEY="migration-cron-${ENVIRONMENT}.tfstate"
LOCK_TABLE=efcms-terraform-lock
REGION=us-east-1

rm -rf .terraform
rm -f .terraform.lock.hcl

terraform init -upgrade -backend=true \
 -backend-config=bucket="$BUCKET" \
 -backend-config=key="$KEY" \
 -backend-config=dynamodb_table="$LOCK_TABLE" \
 -backend-config=region="$REGION"
terraform destroy -auto-approve
