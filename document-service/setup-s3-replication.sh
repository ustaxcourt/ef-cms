#!/bin/bash
stage=$1
BUCKET="efcms-documents-${stage}-us-east-1"
backup_bucket="efcms-documents-${stage}-us-east-2"
accountWithQuotes=$(aws sts get-caller-identity --query "Account")
accountWithQuotePrefix="${accountWithQuotes%\"}"
account="${accountWithQuotePrefix#\"}"

# Replication from A -> B
CONFIGURATION=$(sed "s/ACCOUNT_NUMBER/${account}/g" replication-configuration.json | sed "s/BACKUP_BUCKET/${backup_bucket}/g")
aws s3api put-bucket-replication --bucket "${BUCKET}" --replication-configuration "${CONFIGURATION}"

# Replication from B -> A
CONFIGURATION=$(sed "s/ACCOUNT_NUMBER/${account}/g" replication-configuration.json | sed "s/BACKUP_BUCKET/${BUCKET}/g")
aws s3api put-bucket-replication --bucket "${backup_bucket}" --replication-configuration "${CONFIGURATION}"