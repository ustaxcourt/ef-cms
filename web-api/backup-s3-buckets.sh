#!/bin/bash -e

[ -z "$ENV" ] && echo "The \$ENV variable must be set. Example: example.com" && exit 1
[ -z "$EFCMS_DOMAIN" ] && echo "The \$EFCMS_DOMAIN variable must be set. Example: dev.example.com" && exit 1

# create temp buckets
aws s3api create-bucket --bucket "temp-${EFCMS_DOMAIN}-documents-${ENV}-us-east-1" --region us-east-1
aws s3api create-bucket --bucket "temp-${EFCMS_DOMAIN}-documents-${ENV}-us-west-1" --region us-west-1
aws s3api create-bucket --bucket "temp-${EFCMS_DOMAIN}-temp-documents-${ENV}-us-east-1" --region us-east-1
aws s3api create-bucket --bucket "temp-${EFCMS_DOMAIN}-temp-documents-${ENV}-us-west-1" --region us-west-1

# sync buckets
aws s3 sync "s3://${EFCMS_DOMAIN}-documents-${ENV}-us-east-1" "s3://temp-${EFCMS_DOMAIN}-documents-${ENV}-us-east-1" 
aws s3 sync "s3://${EFCMS_DOMAIN}-documents-${ENV}-us-west-1" "s3://temp-${EFCMS_DOMAIN}-documents-${ENV}-us-west-1" 
aws s3 sync "s3://${EFCMS_DOMAIN}-temp-documents-${ENV}-us-east-1" "s3://temp-${EFCMS_DOMAIN}-temp-documents-${ENV}-us-east-1" 
aws s3 sync "s3://${EFCMS_DOMAIN}-temp-documents-${ENV}-us-west-1" "s3://temp-${EFCMS_DOMAIN}-temp-documents-${ENV}-us-west-1" 