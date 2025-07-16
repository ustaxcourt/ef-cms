#!/bin/bash

ENVIRONMENT=$1

[ -z "${ENVIRONMENT}" ] && echo "You must pass in the environment as an argument to the script" && exit 1
[ -z "${ZONE_NAME}" ] && echo "You must have ZONE_NAME set in your environment" && exit 1

BUCKET="${ZONE_NAME}.terraform.deploys"
KEY="glue-role-${ENVIRONMENT}.tfstate"
LOCK_TABLE=efcms-terraform-lock
REGION=us-east-1

rm -rf .terraform

terraform init -backend=true -backend-config=bucket="${BUCKET}" -backend-config=key="${KEY}" -backend-config=dynamodb_table="${LOCK_TABLE}" -backend-config=region="${REGION}"
