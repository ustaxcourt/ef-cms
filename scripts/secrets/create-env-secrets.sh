#!/bin/bash -e

[[ -z "$BASE_DOMAIN" ]] && echo "You must have BASE_DOMAIN set in your environment" && exit 1
[[ -z "$ENV" ]] && echo "You must have ENV set in your environment" && exit 1
[[ -z "$PROD_DOCUMENTS_BUCKET_NAME" ]] && echo "You must have PROD_DOCUMENTS_BUCKET_NAME set in your environment" && exit 1
[[ -z "$PROD_ENV_ACCOUNT_ID" ]] && echo "You must have PROD_ENV_ACCOUNT_ID set in your environment" && exit 1

REPO_NAME=$(basename -s .git "$(git config --get remote.origin.url)")

EFCMS_DOMAIN="${ENV}.${REPO_NAME}.${BASE_DOMAIN}"
LOWER_ENV_ACCOUNT_ID="$(aws sts get-caller-identity --query 'Account' --output text)"
POSTGRES_MASTER_PASSWORD="$(scripts/user/generate-new-password.ts -c uppercase -c lowercase -c numbers -l 42)"
USTC_ADMIN_PASS="$(scripts/user/generate-new-password.ts)"

ENV_SECRETS="{"
ENV_SECRETS+="\"ENV\": \"${ENV}\","
ENV_SECRETS+="\"EFCMS_DOMAIN\": \"${EFCMS_DOMAIN}\","
ENV_SECRETS+='"DYNAMSOFT_PRODUCT_KEYS": "noop",'
ENV_SECRETS+='"IS_DYNAMSOFT_ENABLED": 0,'
ENV_SECRETS+='"ENABLE_HEALTH_CHECKS": 1,'
ENV_SECRETS+="\"COGNITO_SUFFIX\": \"${ENV}\","
ENV_SECRETS+='"DISABLE_EMAILS": true,'
ENV_SECRETS+='"EMAIL_DMARC_POLICY": "v=DMARC1; p=none; rua=mailto:sxmywkks@ag.us.dmarcian.com;",'
ENV_SECRETS+='"ES_INSTANCE_COUNT": "1",'
ENV_SECRETS+='"ES_INSTANCE_TYPE": "t2.small.search",'
ENV_SECRETS+='"ES_VOLUME_SIZE": 10,'
ENV_SECRETS+="\"IRS_SUPERUSER_EMAIL\": \"service.agent.${ENV}@example.com\","
ENV_SECRETS+="\"USTC_ADMIN_PASS\": \"${USTC_ADMIN_PASS}\","
ENV_SECRETS+='"USTC_ADMIN_USER": "ustcadmin@example.com",'
ENV_SECRETS+='"DEFAULT_ACCOUNT_PASS": "Testing1234$",'
ENV_SECRETS+="\"LOWER_ENV_ACCOUNT_ID\": \"${LOWER_ENV_ACCOUNT_ID}\","
ENV_SECRETS+="\"PROD_ENV_ACCOUNT_ID\": \"${PROD_ENV_ACCOUNT_ID}\","
ENV_SECRETS+="\"PROD_DOCUMENTS_BUCKET_NAME\": \"${PROD_DOCUMENTS_BUCKET_NAME}\","
ENV_SECRETS+="\"POSTGRES_USER\": \"${ENV}_dawson\","
ENV_SECRETS+="\"DATABASE_NAME\": \"${ENV}_dawson\","
ENV_SECRETS+='"POSTGRES_MASTER_USERNAME": "master",'
ENV_SECRETS+="\"POSTGRES_MASTER_PASSWORD\": \"${POSTGRES_MASTER_PASSWORD}\","
ENV_SECRETS+='"RDS_MAX_CAPACITY": 1,'
ENV_SECRETS+='"RDS_MIN_CAPACITY": 0.5,'
ENV_SECRETS+='"RUM_SAMPLE_RATE": 1'
ENV_SECRETS+="}"

aws secretsmanager create-secret \
    --name "${ENV}_deploy" \
    --description "Environment variables for the ${ENV} environment" \
    --secret-string "$ENV_SECRETS"
