#!/bin/bash -e
#
# This script is used for importing a list of judge users from a provided .csv file
#
# usage: 
#   FILE_NAME=./web-api/judge_users.csv ./scripts/bulk-import-judge-users.sh
#

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

USER_POOL_ID=$(aws cognito-idp list-user-pools --query "UserPools[?Name == 'efcms-${ENV}'].Id | [0]" --max-results 30 --region "${REGION}" --output text)

ENV=${ENV} STAGE=${ENV} DEPLOYING_COLOR=${DEPLOYING_COLOR} REGION=${REGION} DYNAMODB_ENDPOINT=dynamodb.${REGION}.amazonaws.com \
S3_ENDPOINT=s3.${REGION}.amazonaws.com DOCUMENTS_BUCKET_NAME=${EFCMS_DOMAIN}-documents-${ENV}-${REGION} \
USER_POOL_ID=${USER_POOL_ID} \
FILE_NAME=${FILE_NAME} node ./scripts/data-import/judge/bulkImportJudgeUsers.js | tee bulk-import-log.txt
