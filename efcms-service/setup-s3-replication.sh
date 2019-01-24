#!/bin/bash -e
stage=$1
BUCKET="${EFCMS_DOMAIN}-documents-${stage}-us-east-1"
backup_bucket="${EFCMS_DOMAIN}-documents-${stage}-us-west-1"
accountWithQuotes=$(aws sts get-caller-identity --query "Account")
accountWithQuotePrefix="${accountWithQuotes%\"}"
account="${accountWithQuotePrefix#\"}"

# Replication from A -> B
echo "setting up replication from ${BUCKET} -> ${backup_bucket}"
CONFIGURATION=$(sed "s/ACCOUNT_NUMBER/${account}/g" replication-configuration.json | sed "s/BACKUP_BUCKET/${backup_bucket}/g" | sed "s/ENV/${stage}/g")
aws s3api put-bucket-replication --bucket "${BUCKET}" --replication-configuration "${CONFIGURATION}"

# Replication from B -> A
echo "setting up replication from ${backup_bucket} -> ${BUCKET}"
CONFIGURATION=$(sed "s/ACCOUNT_NUMBER/${account}/g" replication-configuration.json | sed "s/BACKUP_BUCKET/${BUCKET}/g" | sed "s/ENV/${stage}/g")
aws s3api put-bucket-replication --bucket "${backup_bucket}" --replication-configuration "${CONFIGURATION}"