#!/bin/bash
# creates an S3 bucket for holding Terraform state, assigning appropriate permissions to the AWS user executing the script

BUCKET=$1
if [ -z "${BUCKET}" ]
then
      echo "You must provide a bucket name when calling this script"
      exit 1
fi

KEY=$2
if [ -z "${KEY}" ]
then
      echo "You must provide a key name when calling this script"
      exit 1
fi

REGION=$3
if [ -z "${REGION}" ]
then
      echo "You must provide a region when calling this script"
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
echo "Initiating Terraform state bucket creation for [${MY_ARN}], bucket [${BUCKET}], key [${KEY}] in region [${REGION}]"

SHARED_TERRAFORM_BIN=$(realpath "$(dirname "$0")")

aws s3 mb "s3://${BUCKET}" --region "${REGION}"
sed -e "s/RESOURCE/arn:aws:s3:::${BUCKET}/g" -e "s/KEY/${KEY}/g" -e "s|ARN|${MY_ARN}|g" "${SHARED_TERRAFORM_BIN}/policy.json" > new-policy.json
aws s3api put-bucket-policy --bucket "${BUCKET}" --policy file://new-policy.json
aws s3api put-bucket-versioning --bucket "${BUCKET}" --versioning-configuration Status=Enabled
rm new-policy.json
