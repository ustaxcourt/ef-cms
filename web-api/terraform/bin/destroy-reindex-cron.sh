#!/bin/bash -e

# shellcheck disable=SC1091
ENVIRONMENT=$1

[ -z "${ENVIRONMENT}" ] && echo "You must pass in ENVIRONMENT as command line argument 1" && exit 1
[ -z "${ZONE_NAME}" ] && echo "You must set ZONE_NAME as an environment variable" && exit 1
[ -z "${SOURCE_TABLE}" ] && echo "You must set SOURCE_TABLE as an environment variable" && exit 1
[ -z "${DESTINATION_TABLE}" ] && echo "You set DESTINATION_TABLE as an environment variable" && exit 1
[ -z "${CIRCLE_MACHINE_USER_TOKEN}" ] && echo "You set CIRCLE_MACHINE_USER_TOKEN as an environment variable" && exit 1
[ -z "${CIRCLE_WORKFLOW_ID}" ] && echo "You set CIRCLE_WORKFLOW_ID as an environment variable" && exit 1
[ -z "${MIGRATE_FLAG}" ] && echo "You set MIGRATE_FLAG as an environment variable" && exit 1

echo "Running terraform with the following environment configs:"
echo "  - ENVIRONMENT=${ENVIRONMENT}"
echo "  - ZONE_NAME=${ZONE_NAME}"
echo "  - SOURCE_TABLE=${SOURCE_TABLE}"
echo "  - DESTINATION_TABLE=${DESTINATION_TABLE}"
echo "  - CIRCLE_WORKFLOW_ID=${CIRCLE_WORKFLOW_ID}"
echo "  - MIGRATE_FLAG=${MIGRATE_FLAG}"

DEPLOYMENT_TIMESTAMP=$(date "+%s")

export TF_VAR_circle_machine_user_token=$CIRCLE_MACHINE_USER_TOKEN
export TF_VAR_circle_workflow_id=$CIRCLE_WORKFLOW_ID
export TF_VAR_deployment_timestamp=$DEPLOYMENT_TIMESTAMP
export TF_VAR_destination_table=$DESTINATION_TABLE
export TF_VAR_environment=$ENVIRONMENT
export TF_VAR_migrate_flag=$MIGRATE_FLAG
export TF_VAR_source_table=$SOURCE_TABLE

../../../../scripts/verify-terraform-version.sh

terraform init -upgrade -backend=true \
 -backend-config=bucket="${ZONE_NAME}.terraform.deploys" \
 -backend-config=key="reindex-cron-${ENVIRONMENT}.tfstate" \
 -backend-config=dynamodb_table="efcms-terraform-lock" \
 -backend-config=region="us-east-1"
terraform destroy -auto-approve
