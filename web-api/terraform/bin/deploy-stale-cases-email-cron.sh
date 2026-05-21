#!/usr/bin/env bash
set -e

# shellcheck disable=SC1091
ENVIRONMENT=$1
export ENVIRONMENT="$ENVIRONMENT"

[ -z "$ENVIRONMENT" ] && echo "You must pass in ENVIRONMENT as command line argument 1" && exit 1
[ -z "$DATABASE_NAME" ] && echo "You must set DATABASE_NAME as an environment variable" && exit 1
[ -z "$EFCMS_DOMAIN" ] && echo "You must set EFCMS_DOMAIN as an environment variable" && exit 1
[ -z "$INACTIVITY_REPORT_RECIPIENTS" ] && echo "You must set INACTIVITY_REPORT_RECIPIENTS as an environment variable" && exit 1
[ -z "$POSTGRES_HOST" ] && echo "You must set POSTGRES_HOST as an environment variable" && exit 1
[ -z "$POSTGRES_USER" ] && echo "You must set POSTGRES_USER as an environment variable" && exit 1

if [ -z "$EMAIL_SOURCE" ]; then
  EMAIL_SOURCE="U.S. Tax Court <noreply@${EFCMS_DOMAIN}>"
fi

echo "Running terraform with the following environment configs:"
echo "  - ENVIRONMENT=${ENVIRONMENT}"
echo "  - DATABASE_NAME=${DATABASE_NAME}"
echo "  - EFCMS_DOMAIN=${EFCMS_DOMAIN}"
echo "  - EMAIL_SOURCE=${EMAIL_SOURCE}"
echo "  - INACTIVITY_REPORT_RECIPIENTS=${INACTIVITY_REPORT_RECIPIENTS}"
echo "  - POSTGRES_HOST=${POSTGRES_HOST}"
echo "  - POSTGRES_USER=${POSTGRES_USER}"

../../../../scripts/verify-terraform-version.sh

BUCKET="${EFCMS_DOMAIN}.terraform.deploys"
[ -n "$ZONE_NAME" ] && BUCKET="${ZONE_NAME}.terraform.deploys"
KEY="stale-cases-email-cron-${ENVIRONMENT}.tfstate"
LOCK_TABLE=efcms-terraform-lock
REGION=us-east-1

rm -rf .terraform
rm -f .terraform.lock.hcl

export TF_VAR_environment="$ENVIRONMENT"
export TF_VAR_database_name="$DATABASE_NAME"
export TF_VAR_disable_emails="false"
export TF_VAR_email_source="$EMAIL_SOURCE"
export TF_VAR_inactivity_report_recipients="$INACTIVITY_REPORT_RECIPIENTS"
export TF_VAR_postgres_host="$POSTGRES_HOST"
export TF_VAR_postgres_user="$POSTGRES_USER"

npm run build:assets

terraform init -upgrade -backend=true \
 -backend-config=bucket="$BUCKET" \
 -backend-config=key="$KEY" \
 -backend-config=dynamodb_table="$LOCK_TABLE" \
 -backend-config=region="$REGION"
terraform plan
terraform apply -auto-approve
