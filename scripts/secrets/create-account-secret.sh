#!/bin/bash -e

[[ -z "$ENV" ]] && echo "You must have ENV set in your environment" && exit 1

REPO_NAME=$(basename -s .git "$(git config --get remote.origin.url)")

LOWER_ENV_ACCOUNT_ID="$(aws sts get-caller-identity --query 'Account' --output text)"
LOWER_ENV_SSO_ROLE="$(aws sts get-caller-identity --query 'Arn' --output text | awk -F'/' '{print $2}')"

ENV_SECRETS="{"
ENV_SECRETS+='"ES_LOGS_INSTANCE_COUNT": "1",'
ENV_SECRETS+='"ES_LOGS_INSTANCE_TYPE": "t2.small.search",'
ENV_SECRETS+='"ES_LOGS_EBS_VOLUME_SIZE_GB": "10",'
ENV_SECRETS+="\"COGNITO_SUFFIX\": \"${REPO_NAME}-${ENV}\","
ENV_SECRETS+="\"LOG_GROUP_ENVIRONMENTS\": \"[\\\"${ENV}\\\"]\","
ENV_SECRETS+='"NUM_DAYS_TO_KEEP_LOGS": "30",'
ENV_SECRETS+="\"DAWSON_DEV_TRUSTED_ROLE_ARNS\": \"[\\\"arn:aws:iam::${LOWER_ENV_ACCOUNT_ID}:role/aws-reserved/sso.amazonaws.com/${LOWER_ENV_SSO_ROLE}\\\"]\","
ENV_SECRETS+="\"LOG_SNAPSHOT_BUCKET_NAME\": \"${REPO_NAME}-${ENV}-log-snapshots\""
ENV_SECRETS+="}"

aws secretsmanager create-secret \
    --name "account_deploy" \
    --description "Environment variables for AWS account-specific deploy" \
    --secret-string "$ENV_SECRETS"
