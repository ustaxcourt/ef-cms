#!/bin/bash -e
ENV=$1
REGION=$2
FILE_NAME=$3

USER_POOL_ID=$(aws cognito-idp list-user-pools --query "UserPools[?Name == 'efcms-${ENV}'].Id | [0]" --max-results 30 --region "${REGION}")
USER_POOL_ID="${USER_POOL_ID%\"}"
USER_POOL_ID="${USER_POOL_ID#\"}"

ENV=${ENV} STAGE=${ENV} REGION=${REGION} DYNAMODB_ENDPOINT=dynamodb.${REGION}.amazonaws.com \
S3_ENDPOINT=s3.${REGION}.amazonaws.com DOCUMENTS_BUCKET_NAME=ustc-case-mgmt.flexion.us-documents-${ENV}-${REGION} \
USER_POOL_ID=${USER_POOL_ID} \
node ./bulkImportAttorneyUsers.js ${FILE_NAME}