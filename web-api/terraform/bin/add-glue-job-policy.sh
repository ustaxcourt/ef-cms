#!/bin/bash
# adds an S3 bucket policy for prod glue jobs for the documents bucket on us-east-1, only assigned to the root user on the prod environment

# KEY=$2
# if [ -z "${KEY}" ]
# then
#       echo "You must provide a key name when calling this script"
#       exit 1
# fi

REGION=us-east-1
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
echo "BLAH [${MY_ARN}], bucket [${BUCKET}], key [${KEY}] in region [${REGION}]"

# aws s3 mb "s3://${BUCKET}" --region "${REGION}" check for bucket instead here?
sed -e "s/RESOURCE/arn:aws:s3:::exp5.ustc-case-mgmt.flexion.us-documents-exp5-us-east-1/g" -e "s|ARN|${MY_ARN}|g" "$(dirname "$0")/documents-bucket-policy.json" > new-policy.json
aws s3api put-bucket-policy --bucket "exp5.ustc-case-mgmt.flexion.us-documents-exp5-us-east-1" --policy file://new-policy.json
aws s3api put-bucket-versioning --bucket "exp5.ustc-case-mgmt.flexion.us-documents-exp5-us-east-1" --versioning-configuration Status=Enabled
rm new-policy.json
