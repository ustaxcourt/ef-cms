#!/bin/bash -e

# shellcheck disable=SC1091
ENVIRONMENT=$1

[ -z "${ENVIRONMENT}" ] && echo "You must pass in ENVIRONMENT as command line argument 1" && exit 1
[ -z "${SOURCE_TABLE}" ] && echo "You must set SOURCE_TABLE as an environment variable" && exit 1
[ -z "${DESTINATION_TABLE}" ] && echo "You must set DESTINATION_TABLE as an environment variable" && exit 1
[ -z "${EFCMS_DOMAIN}" ] && echo "You must set EFCMS_DOMAIN as an environment variable" && exit 1

STREAM_ARN=$(aws dynamodbstreams list-streams --region us-east-1 --query "Streams[?TableName=='${SOURCE_TABLE}'].StreamArn | [0]" --output text)
SOURCE_TABLE_VERSION=$(aws dynamodb get-item --region us-east-1 --table-name "efcms-deploy-${ENVIRONMENT}" --key '{"pk":{"S":"source-table-version"},"sk":{"S":"source-table-version"}}' | jq -r ".Item.current.S")
ELASTICSEARCH_ENDPOINT=$(aws es describe-elasticsearch-domain --region us-east-1 --domain-name "efcms-search-${ENVIRONMENT}-${SOURCE_TABLE_VERSION}" --output json | jq -r .DomainStatus.Endpoint)

echo "Running terraform with the following environment configs:"
echo "  - ENVIRONMENT=${ENVIRONMENT}"
echo "  - SOURCE_TABLE=${SOURCE_TABLE}"
echo "  - DESTINATION_TABLE=${DESTINATION_TABLE}"
echo "  - EFCMS_DOMAIN=${EFCMS_DOMAIN}"

../../../../scripts/verify-terraform-version.sh

BUCKET="${EFCMS_DOMAIN}.terraform.deploys"
KEY="migration-${ENVIRONMENT}.tfstate"
LOCK_TABLE=efcms-terraform-lock
REGION=us-east-1

# ZONE_NAME is deprecated and will only be set in legacy accounts
DNS_DOMAIN="$EFCMS_DOMAIN"
if [[ -n "$ZONE_NAME" ]]; then
  BUCKET="${ZONE_NAME}.terraform.deploys"
  DNS_DOMAIN="$ZONE_NAME"
fi

rm -rf .terraform
rm -f .terraform.lock.hcl

export TF_VAR_destination_table=$DESTINATION_TABLE
export TF_VAR_dns_domain=$DNS_DOMAIN
export TF_VAR_environment=$ENVIRONMENT
export TF_VAR_source_table=$SOURCE_TABLE
export TF_VAR_stream_arn=$STREAM_ARN
export TF_VAR_elasticsearch_domain=$ELASTICSEARCH_ENDPOINT

terraform init -upgrade -backend=true \
 -backend-config=bucket="$BUCKET" \
 -backend-config=key="$KEY" \
 -backend-config=dynamodb_table="$LOCK_TABLE" \
 -backend-config=region="$REGION"
terraform destroy -auto-approve
