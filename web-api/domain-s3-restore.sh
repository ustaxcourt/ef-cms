#!/bin/bash -e

[ -z "$ENV" ] && echo "The \$ENV variable must be set. Example: dev, stg, prod" && exit 1
[ -z "$EFCMS_DOMAIN" ] && echo "The \$EFCMS_DOMAIN variable must be set. Example: dev.example.com" && exit 1

# sync temp to new buckets
aws s3 sync "s3://backup-${EFCMS_DOMAIN}-documents-${ENV}-us-east-1" "s3://${EFCMS_DOMAIN}-documents-${ENV}-us-east-1"
aws s3 sync "s3://backup-${EFCMS_DOMAIN}-documents-${ENV}-us-west-1" "s3://${EFCMS_DOMAIN}-documents-${ENV}-us-west-1"
aws s3 sync "s3://backup-${EFCMS_DOMAIN}-temp-documents-${ENV}-us-east-1" "s3://${EFCMS_DOMAIN}-temp-documents-${ENV}-us-east-1"
aws s3 sync "s3://backup-${EFCMS_DOMAIN}-temp-documents-${ENV}-us-west-1" "s3://${EFCMS_DOMAIN}-temp-documents-${ENV}-us-west-1"

# empty temp buckets
aws s3 rm "s3://backup-${EFCMS_DOMAIN}-documents-${ENV}-us-east-1" --recursive
aws s3 rm "s3://backup-${EFCMS_DOMAIN}-documents-${ENV}-us-west-1" --recursive
aws s3 rm "s3://backup-${EFCMS_DOMAIN}-temp-documents-${ENV}-us-east-1" --recursive
aws s3 rm "s3://backup-${EFCMS_DOMAIN}-temp-documents-${ENV}-us-west-1" --recursive

# delete temp buckets
aws s3api delete-bucket --bucket "s3://backup-${EFCMS_DOMAIN}-documents-${ENV}-us-east-1" 
aws s3api delete-bucket --bucket "s3://backup-${EFCMS_DOMAIN}-documents-${ENV}-us-west-1" 
aws s3api delete-bucket --bucket "s3://backup-${EFCMS_DOMAIN}-temp-documents-${ENV}-us-east-1" 
aws s3api delete-bucket --bucket "s3://backup-${EFCMS_DOMAIN}-temp-documents-${ENV}-us-west-1" 