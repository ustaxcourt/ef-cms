#!/bin/bash -e

# Usage
#   smoketest to verify the private buckets are configured as private

# Arguments
#   - $1 - the environment [dev, stg, prod, exp1, exp1, etc]

[ -z "$1" ] && echo "The env to run smoketest to \$1 argument.  An example value of this includes [dev, stg, prod... ]" && exit 1

ENV=$1

BUCKETS=(
  "ustc-case-mgmt.flexion.us-documents-$ENV-us-east-1"
  "ustc-case-mgmt.flexion.us-documents-$ENV-us-west-1"
  "ustc-case-mgmt.flexion.us-temp-documents-$ENV-us-east-1"
  "ustc-case-mgmt.flexion.us-temp-documents-$ENV-us-west-1"
)

for bucket in ${BUCKETS[@]}; do
  # The only way to grant a bucket as public is via a bucket policy, so we check if the policy
  # file exists and throw an error on status codes
  if aws s3api get-bucket-policy --bucket $bucket; then
    echo "ustc-case-mgmt.flexion.us-documents-$ENV-us-east-1 is not private; it has a bucket policy when it should not"
    exit 1;
  fi
done
