#!/bin/bash -e

SLUG=$1

[ -z "${SLUG}" ] && echo "You must pass in SLUG as command line argument 1" && exit 1

SHARED_TERRAFORM_BIN_DIR=$(realpath "$(dirname "$0")")
EFCMS_ROOT_DIR=$(realpath "$(dirname "$0")/../../..")

"${EFCMS_ROOT_DIR}/scripts/verify-terraform-version.sh"

BUCKET="${ZONE_NAME}.terraform.deploys"
KEY="${SLUG}-${ENVIRONMENT}.tfstate"
LOCK_TABLE=efcms-terraform-lock
REGION=us-east-1

rm -rf .terraform

echo "Initiating provisioning for environment [${ENVIRONMENT}] in AWS region [${REGION}]"
sh "${SHARED_TERRAFORM_BIN_DIR}/create-bucket.sh" "${BUCKET}" "${KEY}" "${REGION}"

echo "checking for the dynamodb lock table..."
aws dynamodb list-tables --output json --region "${REGION}" --query "contains(TableNames, '${LOCK_TABLE}')" | grep 'true'
result=$?
if [ ${result} -ne 0 ]; then
  echo "dynamodb lock does not exist, creating"
  sh "${SHARED_TERRAFORM_BIN_DIR}/create-dynamodb.sh" "${LOCK_TABLE}" "${REGION}"
else
  echo "dynamodb lock table already exists"
fi

npm run build:assets

set -eo pipefail
npm run "build:lambda:${SLUG}"

export TF_VAR_environment=$ENVIRONMENT
