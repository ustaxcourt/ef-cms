#!/bin/bash -e

./check-env-variables.sh \
  "REGION" \
  "ENVIRONMENT" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

REGION=us-east-1
content=$(aws secretsmanager get-secret-value --region ${REGION} --secret-id "${ENVIRONMENT}_deploy" --query "SecretString" --output text)
echo $content
echo ${content} | jq -r 'to_entries|map("\(.key)=\"\(.value)\"")|.[]' > .env
set -o allexport
source .env
set +o allexport