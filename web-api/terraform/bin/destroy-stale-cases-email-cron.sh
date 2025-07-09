#!/bin/bash -e

# shellcheck disable=SC1091
ENVIRONMENT=$1

[ -z "${ENVIRONMENT}" ] && echo "You must pass in ENVIRONMENT as command line argument 1" && exit 1
[ -z "${ELASTICSEARCH_ENDPOINT}" ] && echo "You must set ELASTICSEARCH_ENDPOINT as an environment variable" && exit 1
[ -z "${INACTIVITY_REPORT_RECIPIENTS}" ] && echo "You must set INACTIVITY_REPORT_RECIPIENTS as an environment variable" && exit 1
[ -z "$EFCMS_DOMAIN" ] && echo "You must set EFCMS_DOMAIN as an environment variable" && exit 1

if [ -z "$EMAIL_SOURCE" ]; then
  EMAIL_SOURCE="U.S. Tax Court <noreply@${EFCMS_DOMAIN}>"
fi

echo "Running terraform with the following environment configs:"
echo "  - ENVIRONMENT=${ENVIRONMENT}"
echo "  - ELASTICSEARCH_ENDPOINT=${ELASTICSEARCH_ENDPOINT}"
echo "  - EMAIL_SOURCE=${EMAIL_SOURCE}"
echo "  - INACTIVITY_REPORT_RECIPIENTS=${INACTIVITY_REPORT_RECIPIENTS}"

export ENVIRONMENT="$ENVIRONMENT"

export TF_VAR_environment="$ENVIRONMENT"
export TF_VAR_elasticsearch_endpoint="$ELASTICSEARCH_ENDPOINT"
export TF_VAR_disable_emails="false"
export TF_VAR_email_source="$EMAIL_SOURCE"
export TF_VAR_inactivity_report_recipients="$INACTIVITY_REPORT_RECIPIENTS"

../../../../scripts/verify-terraform-version.sh

terraform init -upgrade -backend=true \
 -backend-config=bucket="${EFCMS_DOMAIN}.terraform.deploys" \
 -backend-config=key="stale-cases-email-cron-${ENVIRONMENT}.tfstate" \
 -backend-config=dynamodb_table="efcms-terraform-lock" \
 -backend-config=region="us-east-1"
terraform destroy -auto-approve
