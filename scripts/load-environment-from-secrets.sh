#!/bin/bash -e

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

if [ $? -eq 0 ]; then
  REGION=us-east-1
  content=$(aws secretsmanager get-secret-value --region ${REGION} --secret-id "${ENV}_deploy" --query "SecretString" --output text)
  echo $content
  echo ${content} | jq -r 'to_entries|map("\(.key)=\"\(.value)\"")|.[]' > .env
  set -o allexport
  source .env
  set +o allexport
else
  echo "Aborted load-environment-from-secrets.sh"
fi
