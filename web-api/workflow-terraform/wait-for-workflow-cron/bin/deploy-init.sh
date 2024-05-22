#!/bin/bash -e

ENVIRONMENT=$1

[ -z "${ENVIRONMENT}" ] && echo "You must pass in ENVIRONMENT as command line argument 1" && exit 1
[ -z "${CIRCLE_PIPELINE_ID}" ] && echo "You must set CIRCLE_PIPELINE_ID as an environment variable" && exit 1
[ -z "${APPROVAL_JOB_NAME}" ] && echo "You must set APPROVAL_JOB_NAME as an environment variable" && exit 1

echo "Running terraform with the following environment configs:"
echo "  - ENVIRONMENT=${ENVIRONMENT}"
echo "  - CIRCLE_PIPELINE_ID=${CIRCLE_PIPELINE_ID}"
echo "  - APPROVAL_JOB_NAME=${APPROVAL_JOB_NAME}"

export ENVIRONMENT="${ENVIRONMENT}"

export TF_VAR_circle_machine_user_token=$CIRCLE_MACHINE_USER_TOKEN
export TF_VAR_circle_workflow_id=$CIRCLE_WORKFLOW_ID
export TF_VAR_circle_pipeline_id=$CIRCLE_PIPELINE_ID
export TF_VAR_approval_job_name=$APPROVAL_JOB_NAME
export TF_VAR_environment=$ENVIRONMENT

../../../../shared/terraform/bin/init.sh wait-for-workflow-cron
