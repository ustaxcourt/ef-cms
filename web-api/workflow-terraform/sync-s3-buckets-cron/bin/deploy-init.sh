#!/bin/bash -e

ENVIRONMENT=$1

[ -z "${ENVIRONMENT}" ] && echo "You must pass in ENVIRONMENT as command line argument 1" && exit 1
[ -z "${DESTINATION_BUCKET_NAME}" ] && echo "You must set DESTINATION_BUCKET_NAME as an environment variable" && exit 1
[ -z "${SOURCE_BUCKET_NAME}" ] && echo "You must set SOURCE_BUCKET_NAME as an environment variable" && exit 1

echo "Running terraform with the following environment configs:"
echo "  - ENVIRONMENT=${ENVIRONMENT}"
echo "  - DESTINATION_BUCKET_NAME=${DESTINATION_BUCKET_NAME}"
echo "  - SOURCE_BUCKET_NAME=${SOURCE_BUCKET_NAME}"

export ENVIRONMENT="${ENVIRONMENT}"

export TF_VAR_circle_machine_user_token=$CIRCLE_MACHINE_USER_TOKEN
export TF_VAR_circle_workflow_id=$CIRCLE_WORKFLOW_ID
export TF_VAR_environment=$ENVIRONMENT
export TF_VAR_destination_bucket_name=$DESTINATION_BUCKET_NAME
export TF_VAR_source_bucket_name=$SOURCE_BUCKET_NAME

../../../../shared/terraform/bin/init.sh sync-s3-buckets-cron --build-lambda
