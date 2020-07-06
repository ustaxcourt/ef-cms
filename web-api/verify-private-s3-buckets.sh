#!/bin/bash

# Usage
#   smoketest to verify the private buckets are configured as private

# Arguments
#   - $1 - the environment [dev, stg, prod, exp1, exp1, etc]

[ -z "$1" ] && echo "ERROR: The env to run smoketest to \$1 argument.  An example value of this includes [dev, stg, prod... ]" && exit 1

ENV=$1

BUCKETS=(
  "ustc-case-mgmt.flexion.us-documents-$ENV-us-east-1"
  "ustc-case-mgmt.flexion.us-documents-$ENV-us-west-1"
  "ustc-case-mgmt.flexion.us-temp-documents-$ENV-us-east-1"
  "ustc-case-mgmt.flexion.us-temp-documents-$ENV-us-west-1"
)

for bucket in "${BUCKETS[@]}"; do
  # The only way to grant a bucket as public is via a bucket policy, so we check if the policy
  # file exists and throw an error on status codes
  $(aws s3api get-bucket-policy --bucket "${bucket}")
  code=$?
  if [ "${code}" == "0" ]; then
    echo "ERROR: the bucket of $bucket is not private; it has a bucket policy when it should not"
    exit 1
  fi

  # there should be a public access block defined for the buckets
  blocks=$(aws s3api get-public-access-block --bucket $bucket)
  blockPublicAcls=$(echo "${blocks}" | jq -r ".PublicAccessBlockConfiguration.BlockPublicAcls")
  ignorePublicAcls=$(echo "${blocks}" | jq -r ".PublicAccessBlockConfiguration.IgnorePublicAcls")
  blockPublicPolicy=$(echo "${blocks}" | jq -r ".PublicAccessBlockConfiguration.BlockPublicPolicy")
  restrictPublicBuckets=$(echo "${blocks}" | jq -r ".PublicAccessBlockConfiguration.RestrictPublicBuckets")

  [ "${blockPublicAcls}" != "true" ] && echo "ERROR: the bucket of $bucket is not fully private: BlockPublicAcls must be set to true" && exit 1
  [ "${ignorePublicAcls}" != "true" ] && echo "ERROR: the bucket of $bucket is not fully private: IgnorePublicAcls must be set to true" && exit 1
  [ "${blockPublicPolicy}" != "true" ] && echo "ERROR: the bucket of $bucket is not fully private: BlockPublicPolicy must be set to true" && exit 1
  [ "${restrictPublicBuckets}" != "true" ] && echo "ERROR: the bucket of $bucket is not fully private: RestrictPublicBuckets must be set to true" && exit 1
done

echo "all buckets are private"