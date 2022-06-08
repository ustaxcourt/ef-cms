#!/bin/bash -e

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  echo "Aborted load-environment-from-secrets.sh"
  exit $EXIT_CODE
fi

REGION=us-east-1
content=$(aws secretsmanager get-secret-value --region "${REGION}" --secret-id "${ENV}_deploy" --query "SecretString" --output text)
echo "${content}" | jq -r 'to_entries|map("\(.key)=\"\(.value)\"")|.[]' > .env
set -o allexport
source .env
set +o allexport