#!/bin/bash -e
#
# This script is used for importing a list of judge users from a provided .csv file
#
# usage: 
#   FILE_NAME=./scripts/circleci/judge/judge_users.csv ./scripts/circleci/judge/bulk-import-judge-users.sh
#

# Getting the account-wide deployment settings and injecting them into the shell environment
if [ -z "${SECRETS_LOADED}" ]; then
  # shellcheck disable=SC1091
  . ./scripts/load-environment-from-secrets.sh
fi

if [ -z "${CI}" ]; then
  ./check-env-variables.sh \
    "ENV" \
    "USTC_ADMIN_PASS" \
    "USTC_ADMIN_USER" \
    "REGION" \
    "FILE_NAME" \
    "DEFAULT_ACCOUNT_PASS" \
    "DEPLOYING_COLOR" \
    "AWS_SECRET_ACCESS_KEY" \
    "AWS_ACCESS_KEY_ID"
fi

USER_POOL_ID=$(aws cognito-idp list-user-pools --query "UserPools[?Name == 'efcms-${ENV}'].Id | [0]" --max-results 30 --region "${REGION}" --output text)

export ENV
export REGION
export DEPLOYING_COLOR
export USER_POOL_ID
export FILE_NAME

STAGE=${ENV} \
  DYNAMODB_ENDPOINT="dynamodb.${REGION}.amazonaws.com" \
  S3_ENDPOINT="s3.${REGION}.amazonaws.com" \
  DOCUMENTS_BUCKET_NAME="${EFCMS_DOMAIN}-documents-${ENV}-${REGION}" \
  npx ts-node --transpile-only ./scripts/circleci/judge/bulkImportJudgeUsers.ts | tee bulk-import-log.txt
