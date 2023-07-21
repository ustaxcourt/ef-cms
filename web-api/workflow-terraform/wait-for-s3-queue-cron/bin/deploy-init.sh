#!/bin/bash -e

ENVIRONMENT=$1

[ -z "${ENVIRONMENT}" ] && echo "You must pass in ENVIRONMENT as command line argument 1" && exit 1
[ -z "${ZONE_NAME}" ] && echo "You must set ZONE_NAME as an environment variable" && exit 1
[ -z "${S3_BUCKET_QUEUE_URL}" ] && echo "You must set S3_BUCKET_QUEUE_URL as an environment variable" && exit 1
[ -z "${S3_BUCKET_DL_QUEUE_URL}" ] && echo "You must set S3_BUCKET_DL_QUEUE_URL as an environment variable" && exit 1
[ -z "${BUCKET_NAME}" ] && [ -n "${DESTINATION_BUCKET_NAME}" ] && BUCKET_NAME="$DESTINATION_BUCKET_NAME"
[ -z "${EMPTYING_BUCKET}" ] && EMPTYING_BUCKET=0
[ "$EMPTYING_BUCKET" -eq 1 ] && [ -z "${BUCKET_NAME}" ] && echo "You must set BUCKET_NAME as an environment variable" && exit 1

echo "Running terraform with the following environment configs:"
echo "  - ENVIRONMENT=${ENVIRONMENT}"
echo "  - ZONE_NAME=${ZONE_NAME}"
echo "  - S3_BUCKET_QUEUE_URL=${S3_BUCKET_QUEUE_URL}"
echo "  - S3_BUCKET_DL_QUEUE_URL=${S3_BUCKET_DL_QUEUE_URL}"
[ -n "${BUCKET_NAME}" ] && echo "  - BUCKET_NAME=${BUCKET_NAME}"
echo "  - EMPTYING_BUCKET=${EMPTYING_BUCKET}"

export ENVIRONMENT="${ENVIRONMENT}"

export TF_VAR_circle_machine_user_token=$CIRCLE_MACHINE_USER_TOKEN
export TF_VAR_circle_workflow_id=$CIRCLE_WORKFLOW_ID
export TF_VAR_environment=$ENVIRONMENT
export TF_VAR_s3_bucket_queue_url=$S3_BUCKET_QUEUE_URL
export TF_VAR_s3_bucket_dl_queue_url=$S3_BUCKET_DL_QUEUE_URL
export TF_VAR_bucket_name=$BUCKET_NAME
export TF_VAR_emptying_bucket=$EMPTYING_BUCKET

../../../../shared/terraform/bin/init.sh wait-for-s3-queue-cron --build-lambda
