#!/bin/bash -e

# shellcheck disable=SC1091
ENVIRONMENT=$1

[ -z "${ENVIRONMENT}" ] && echo "You must pass in ENVIRONMENT as command line argument 1" && exit 1
[ -z "${BOUNCED_EMAIL_RECIPIENT}" ] && echo "You must set BOUNCED_EMAIL_RECIPIENT as an environment variable" && exit 1
[ -z "${EMAIL_SOURCE}" ] && echo "You must set EMAIL_SOURCE as an environment variable" && exit 1
[ -z "${INACTIVITY_REPORT_RECIPIENTS}" ] && echo "You must set INACTIVITY_REPORT_RECIPIENTS as an environment variable" && exit 1

echo "Running terraform with the following environment configs:"
echo "  - ENVIRONMENT=${ENVIRONMENT}"
echo "  - BOUNCED_EMAIL_RECIPIENT=${BOUNCED_EMAIL_RECIPIENT}"
echo "  - EMAIL_SOURCE=${EMAIL_SOURCE}"
echo "  - INACTIVITY_REPORT_RECIPIENTS=${INACTIVITY_REPORT_RECIPIENTS}"

export ENVIRONMENT="$ENVIRONMENT"

export TF_VAR_environment="$ENVIRONMENT"
export TF_VAR_bounced_email_recipient="$BOUNCED_EMAIL_RECIPIENT"
export TF_VAR_disable_emails="false"
export TF_VAR_email_source="$EMAIL_SOURCE"
export TF_VAR_inactivity_report_recipients="$INACTIVITY_REPORT_RECIPIENTS"

../../../../scripts/verify-terraform-version.sh

npm run build:assets

terraform init -upgrade -backend=true \
 -backend-config=bucket="${ZONE_NAME}.terraform.deploys" \
 -backend-config=key="stale-cases-email-cron-${ENVIRONMENT}.tfstate" \
 -backend-config=dynamodb_table="efcms-terraform-lock" \
 -backend-config=region="us-east-1"
terraform plan
terraform apply -auto-approve
