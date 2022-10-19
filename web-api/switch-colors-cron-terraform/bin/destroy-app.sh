#!/bin/bash

ENVIRONMENT=$1

[ -z "${EFCMS_DOMAIN}" ] && echo "You must have EFCMS_DOMAIN set in your environment" && exit 1

echo "Running terraform with the following environment configs:"
echo "  - ENVIRONMENT=${ENVIRONMENT}"

../../../scripts/verify-terraform-version.sh

BUCKET="${ZONE_NAME}.terraform.deploys"
KEY="migrations-cron-${ENVIRONMENT}.tfstate"
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

npm run build:assets

set -eo pipefail
npm run build:lambda:migration-cron

export TF_VAR_circle_machine_user_token=$CIRCLE_MACHINE_USER_TOKEN
export TF_VAR_circle_workflow_id=$CIRCLE_WORKFLOW_ID
export TF_VAR_deploying_color=$DEPLOYING_COLOR
export TF_VAR_destination_table=$DESTINATION_TABLE
export TF_VAR_environment=$ENVIRONMENT
export TF_VAR_migrate_flag=$MIGRATE_FLAG
export TF_VAR_reindex_flag=$REINDEX_FLAG
export TF_VAR_source_table=$SOURCE_TABLE
export TF_VAR_stream_arn=$STREAM_ARN

mkdir -p ./lambdas/dist
touch ./lambdas/dist/reindex-status.js

terraform init -backend=true -backend-config=bucket="${BUCKET}" -backend-config=key="${KEY}" -backend-config=dynamodb_table="${LOCK_TABLE}" -backend-config=region="${REGION}"
terraform plan -destroy -out execution-plan
terraform destroy -auto-approve  
