#!/bin/bash -e

ENVIRONMENT=$1

[ -z "${ENVIRONMENT}" ] && echo "You must pass in ENVIRONMENT as command line argument 1" && exit 1
[ -z "${DOCUMENTS_BUCKET_NAME}" ] && echo "You must set DOCUMENTS_BUCKET_NAME as an environment variable" && exit 1

echo "Running terraform with the following environment configs:"
echo "  - ENVIRONMENT=${ENVIRONMENT}"
echo "  - DOCUMENTS_BUCKET_NAME=${DOCUMENTS_BUCKET_NAME}"

export ENVIRONMENT="${ENVIRONMENT}"

export TF_VAR_circle_machine_user_token=$CIRCLE_MACHINE_USER_TOKEN
export TF_VAR_circle_workflow_id=$CIRCLE_WORKFLOW_ID
export TF_VAR_environment=$ENVIRONMENT
export TF_VAR_documents_bucket_name=$DOCUMENTS_BUCKET_NAME

../../../../shared/terraform/bin/init.sh empty-s3-bucket-cron --build-lambda
