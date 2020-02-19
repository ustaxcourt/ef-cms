#!/bin/bash -e
export ENV=$1
export REGION=$2
export SIZE=$3

export STAGE="${ENV}"

SIZE="${SIZE}" DYNAMODB_ENDPOINT="dynamodb.${REGION}.amazonaws.com" S3_ENDPOINT="s3.${REGION}.amazonaws.com" DOCUMENTS_BUCKET_NAME="ustc-case-mgmt.flexion.us-documents-${ENV}-${REGION}" node ./web-api/storage/scripts/trialSession/loadTest.js
