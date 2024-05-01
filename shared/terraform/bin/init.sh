#!/bin/bash -e

SLUG=$1

[ -z "${SLUG}" ] && echo "You must pass in SLUG as command line argument 1" && exit 1

SHARED_TERRAFORM_BIN=$(realpath "$(dirname "$0")")
EFCMS_ROOT=$(realpath "$(dirname "$0")/../../..")

"${EFCMS_ROOT}/scripts/verify-terraform-version.sh"

BUCKET="${ZONE_NAME}.terraform.deploys"
KEY="${SLUG}-${ENVIRONMENT}.tfstate"
LOCK_TABLE=efcms-terraform-lock
REGION=us-east-1

rm -rf .terraform

echo "Initiating provisioning for environment [${ENVIRONMENT}] in AWS region [${REGION}]"
sh "${SHARED_TERRAFORM_BIN}/create-bucket.sh" "${BUCKET}" "${KEY}" "${REGION}"

echo "checking for the dynamodb lock table..."
aws dynamodb list-tables --output json --region "${REGION}" --query "contains(TableNames, '${LOCK_TABLE}')" | grep 'true'
result=$?
if [ ${result} -ne 0 ]; then
  echo "dynamodb lock does not exist, creating"
  sh "${SHARED_TERRAFORM_BIN}/create-dynamodb.sh" "${LOCK_TABLE}" "${REGION}"
else
  echo "dynamodb lock table already exists"
fi

npm run build:assets

set -eo pipefail

terraform init -upgrade -backend=true \
 -backend-config=bucket="${BUCKET}" \
 -backend-config=key="${KEY}" \
 -backend-config=dynamodb_table="${LOCK_TABLE}" \
 -backend-config=region="${REGION}"
