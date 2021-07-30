#!/bin/bash -e

[ -z "$ENV" ] && echo "The \$ENV variable must be set. Example: dev, stg, prod" && exit 1
[ -z "$ZONE_NAME" ] && echo "The \$ZONE_NAME variable must be set. Example: example.com" && exit 1
[ -z "$EFCMS_DOMAIN" ] && echo "The \$EFCMS_DOMAIN variable must be set. Example: dev.example.com" && exit 1

# create backup buckets
aws s3 mb "s3://bck-${EFCMS_DOMAIN}-documents-${ENV}-us-east-1" --region us-east-1
aws s3 mb "s3://bck-${EFCMS_DOMAIN}-documents-${ENV}-us-west-1" --region us-west-1
aws s3 mb "s3://bck-${EFCMS_DOMAIN}-temp-documents-${ENV}-us-east-1" --region us-east-1
aws s3 mb "s3://bck-${EFCMS_DOMAIN}-temp-documents-${ENV}-us-west-1" --region us-west-1
aws s3 mb "s3://bck-${EFCMS_DOMAIN}-quarantine-${ENV}-us-east-1" --region us-east-1
aws s3 mb "s3://bck-${EFCMS_DOMAIN}-quarantine-${ENV}-us-west-1" --region us-west-1

# sync old buckets to backup buckets
aws s3 sync "s3://${ZONE_NAME}-documents-${ENV}-us-east-1" "s3://bck-${EFCMS_DOMAIN}-documents-${ENV}-us-east-1"
aws s3 sync "s3://${ZONE_NAME}-documents-${ENV}-us-west-1" "s3://bck-${EFCMS_DOMAIN}-documents-${ENV}-us-west-1"
aws s3 sync "s3://${ZONE_NAME}-temp-documents-${ENV}-us-east-1" "s3://bck-${EFCMS_DOMAIN}-temp-documents-${ENV}-us-east-1"
aws s3 sync "s3://${ZONE_NAME}-temp-documents-${ENV}-us-west-1" "s3://bck-${EFCMS_DOMAIN}-temp-documents-${ENV}-us-west-1"
aws s3 sync "s3://${ZONE_NAME}-quarantine-${ENV}-us-east-1" "s3://bck-${EFCMS_DOMAIN}-quarantine-${ENV}-us-east-1" 
aws s3 sync "s3://${ZONE_NAME}-quarantine-${ENV}-us-west-1" "s3://bck-${EFCMS_DOMAIN}-quarantine-${ENV}-us-west-1"

echo "Old buckets are now backed up. You must first empty and then delete the following buckets:"
echo "=> ${ZONE_NAME}-documents-${ENV}-us-east-1"
echo "=> ${ZONE_NAME}-documents-${ENV}-us-west-1"
echo "=> ${ZONE_NAME}-temp-documents-${ENV}-us-east-1"
echo "=> ${ZONE_NAME}-temp-documents-${ENV}-us-west-1"
echo "=> ${ZONE_NAME}-quarantine-${ENV}-us-east-1"
echo "=> ${ZONE_NAME}-quarantine-${ENV}-us-west-1"
