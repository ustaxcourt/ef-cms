#!/bin/bash -e
ENV=$1
REGION=$2
SIZE=$3

ENV=${ENV} STAGE=${ENV} REGION=${REGION} SIZE=${SIZE} DYNAMODB_ENDPOINT=dynamodb.${REGION}.amazonaws.com \
S3_ENDPOINT=s3.${REGION}.amazonaws.com DOCUMENTS_BUCKET_NAME=${EFCMS_DOMAIN}-documents-${ENV}-${REGION} \
node ./web-api/storage/scripts/loadTest/loadTestTrialSession.js
