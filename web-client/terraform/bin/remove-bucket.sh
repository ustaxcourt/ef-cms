#!/bin/bash
# removes an S3 bucket holding Terraform state, including all versions.  Cannot be undone.

BUCKET=$1
if [ -z "${BUCKET}" ]
then
      echo "You must provide a bucket name name when calling this script"
      exit 1
fi

REGION=$2
if [ -z "${REGION}" ]
then
      echo "You must provide a region when calling this script"
      exit 1
fi


echo "Initiating Terraform state bucket removal for bucket [${BUCKET}] in region [${REGION}]"

aws s3api put-bucket-versioning --bucket ${BUCKET} --versioning-configuration Status=Suspended
# remove all versions
aws --output text s3api list-object-versions --bucket ${BUCKET} | egrep -e '^VERSIONS' |  awk -v bucket=${BUCKET} '{print "aws s3api delete-object --bucket " bucket " --key "$4" --version-id "$8";"}' >> /tmp/deleteBucketScript.sh && . /tmp/deleteBucketScript.sh; rm -f /tmp/deleteBucketScript.sh
# remove 
aws --output text s3api list-object-versions --bucket ${BUCKET} | egrep -e '^DELETEMARKERS' | grep -v "null" | awk -v bucket=${BUCKET} '{print "aws s3api delete-object --bucket " bucket " --key "$3" --version-id "$5";"}' >> /tmp/deleteBucketScript.sh && . /tmp/deleteBucketScript.sh; rm -f /tmp/deleteBucketScript.sh;
aws s3 rm s3://${BUCKET} --recursive --region ${REGION}
aws s3 rb s3://${BUCKET} --region ${REGION}
