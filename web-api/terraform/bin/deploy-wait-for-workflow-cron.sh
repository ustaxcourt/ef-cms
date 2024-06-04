#!/bin/bash -e

# shellcheck disable=SC1091
ENVIRONMENT=$1

[ -z "${ENVIRONMENT}" ] && echo "You must pass in ENVIRONMENT as command line argument 1" && exit 1
[ -z "${CIRCLE_PIPELINE_ID}" ] && echo "You must set CIRCLE_PIPELINE_ID as an environment variable" && exit 1
[ -z "${APPROVAL_JOB_NAME}" ] && echo "You must set APPROVAL_JOB_NAME as an environment variable" && exit 1
[ -z "${CIRCLE_MACHINE_USER_TOKEN}" ] && echo "You must set CIRCLE_MACHINE_USER_TOKEN as an environment variable" && exit 1
[ -z "${CIRCLE_WORKFLOW_ID}" ] && echo "You must set CIRCLE_WORKFLOW_ID as an environment variable" && exit 1
[ -z "${CIRCLE_PIPELINE_ID}" ] && echo "You must set CIRCLE_PIPELINE_ID as an environment variable" && exit 1

echo "Running terraform with the following environment configs:"
echo "  - ENVIRONMENT=${ENVIRONMENT}"
echo "  - CIRCLE_WORKFLOW_ID=${CIRCLE_WORKFLOW_ID}"
echo "  - CIRCLE_PIPELINE_ID=${CIRCLE_PIPELINE_ID}"
echo "  - APPROVAL_JOB_NAME=${APPROVAL_JOB_NAME}"

export TF_VAR_circle_machine_user_token=$CIRCLE_MACHINE_USER_TOKEN
export TF_VAR_circle_workflow_id=$CIRCLE_WORKFLOW_ID
export TF_VAR_circle_pipeline_id=$CIRCLE_PIPELINE_ID
export TF_VAR_approval_job_name=$APPROVAL_JOB_NAME
export TF_VAR_environment=$ENVIRONMENT

../../../../scripts/verify-terraform-version.sh

npm run build:assets

terraform init -upgrade -backend=true \
 -backend-config=bucket="${ZONE_NAME}.terraform.deploys" \
 -backend-config=key="wait-for-workflow-cron-${ENVIRONMENT}.tfstate" \
 -backend-config=dynamodb_table="efcms-terraform-lock" \
 -backend-config=region="us-east-1"
terraform plan
terraform apply -auto-approve
