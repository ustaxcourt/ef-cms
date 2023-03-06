#!/bin/bash -e

ENVIRONMENT=$1

[ -z "${ENVIRONMENT}" ] && echo "You must pass in ENVIRONMENT as command line argument 1" && exit 1
[ -z "${ZONE_NAME}" ] && echo "You must set ZONE_NAME as an environment variable" && exit 1
[ -z "${SOURCE_TABLE}" ] && echo "You must set SOURCE_TABLE as an environment variable" && exit 1
[ -z "${DESTINATION_TABLE}" ] && echo "You must set DESTINATION_TABLE as an environment variable" && exit 1
[ -z "${EFCMS_DOMAIN}" ] && echo "You must set EFCMS_DOMAIN as an environment variable" && exit 1
[ -z "${DOCUMENTS_BUCKET_NAME}" ] && DOCUMENTS_BUCKET_NAME="${EFCMS_DOMAIN}-documents-${ENVIRONMENT}-${REGION}"

echo "Running terraform with the following environment configs:"
echo "  - ENVIRONMENT=${ENVIRONMENT}"
echo "  - ZONE_NAME=${ZONE_NAME}"
echo "  - SOURCE_TABLE=${SOURCE_TABLE}"
echo "  - DESTINATION_TABLE=${DESTINATION_TABLE}"
echo "  - EFCMS_DOMAIN=${EFCMS_DOMAIN}"
echo "  - DOCUMENTS_BUCKET_NAME=${DOCUMENTS_BUCKET_NAME}"

export ENVIRONMENT="${ENVIRONMENT}"

STREAM_ARN=$(aws dynamodbstreams list-streams --region us-east-1 --query "Streams[?TableName=='${SOURCE_TABLE}'].StreamArn | [0]" --output text)

export TF_VAR_destination_table=$DESTINATION_TABLE
export TF_VAR_dns_domain=$EFCMS_DOMAIN
export TF_VAR_documents_bucket_name=$DOCUMENTS_BUCKET_NAME
export TF_VAR_environment=$ENVIRONMENT
export TF_VAR_source_table=$SOURCE_TABLE
export TF_VAR_stream_arn=$STREAM_ARN

../../../../shared/terraform/bin/init.sh migration --build-lambda
