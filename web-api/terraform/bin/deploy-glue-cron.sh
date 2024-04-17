#!/bin/bash -e

# shellcheck disable=SC1091
ENVIRONMENT=$1

[ -z "${ENVIRONMENT}" ] && echo "You must pass in ENVIRONMENT as command line argument 1" && exit 1

echo "Running terraform with the following environment configs:"
echo "  - ENVIRONMENT=${ENVIRONMENT}"

export ENVIRONMENT="${ENVIRONMENT}"
export TF_VAR_circle_machine_user_token=$CIRCLE_MACHINE_USER_TOKEN
export TF_VAR_circle_workflow_id=$CIRCLE_WORKFLOW_ID
export TF_VAR_environment=$ENVIRONMENT

../../../../scripts/verify-terraform-version.sh

terraform init -upgrade -backend=true \
 -backend-config=bucket="${ZONE_NAME}.terraform.deploys" \
 -backend-config=key="glue-cron-${ENVIRONMENT}.tfstate" \
 -backend-config=dynamodb_table="efcms-terraform-lock" \
 -backend-config=region="us-east-1"
terraform plan
terraform apply -auto-approve
