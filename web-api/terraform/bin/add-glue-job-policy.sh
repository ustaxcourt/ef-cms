#!/bin/bash
# adds an S3 bucket policy for prod glue jobs for the documents bucket on us-east-1, only assigned to the root user on the prod environment

DOCUMENTS_BUCKET=$1
if [ -z "${DOCUMENTS_BUCKET}" ]
then
      echo "You must provide a documents bucket name when calling this script"
      exit 1
fi

MY_ARN=$(aws iam get-user --query User.Arn --output text 2>/dev/null)
if [ -z "${MY_ARN}" ]
then
  echo "User ARN not found, checking for role"
  MY_ARN=$(aws sts get-caller-identity --query Arn --output text)
  if [ -z "${MY_ARN}" ]
  then
    echo "An arn for the current user/role could not be parsed from the aws cli"
    exit 1
  fi
fi
echo "Adding s3 policy for ARN [${MY_ARN}] on bucket [${DOCUMENTS_BUCKET}]"

sed -e "s/RESOURCE/arn:aws:s3:::${DOCUMENTS_BUCKET}/g" -e "s|ARN|${MY_ARN}|g" "$(dirname "$0")/documents-bucket-policy.json" > new-policy.json
aws s3api put-bucket-policy --bucket "${DOCUMENTS_BUCKET}" --policy file://new-policy.json
aws s3api put-bucket-versioning --bucket "${DOCUMENTS_BUCKET}" --versioning-configuration Status=Enabled
rm new-policy.json