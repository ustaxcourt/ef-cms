#!/bin/bash -e
ENV=$1
REGION=$2
SIZE=$3

[ -z "${EFCMS_DOMAIN}" ] && echo "You must have EFCMS_DOMAIN set in your environment" && exit 1
[ -z "${DEFAULT_ACCOUNT_PASS}" ] && echo "You must have DEFAULT_ACCOUNT_PASS set in your environment" && exit 1

export ENV
export REGION
export SIZE

STAGE="${ENV}" \
    DYNAMODB_ENDPOINT="dynamodb.${REGION}.amazonaws.com" \
    S3_ENDPOINT="s3.${REGION}.amazonaws.com" \
    DOCUMENTS_BUCKET_NAME="${EFCMS_DOMAIN}-documents-${ENV}-${REGION}" \
    node ./web-api/storage/scripts/loadTest/loadTestPractitionerAssociations.js
