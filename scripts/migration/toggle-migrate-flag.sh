#!/bin/bash

./check-env-variables.sh \
  "ENV" \
  "AWS_ACCOUNT_ID" \
  "AWS_SECRET_ACCESS_KEY"

TOGGLE="false"
if [[ -n "$1" ]] && { [[ "$1" == "on" ]] || [[ "$1" == "ON" ]] || [[ "$1" == "-on" ]] || [[ "$1" == "--on" ]]; }; then
    TOGGLE="true"
fi

aws dynamodb put-item \
  --region us-east-1 \
  --table-name "efcms-deploy-${ENV}" \
  --item "{\"pk\":{\"S\":\"migrate\"},\"sk\":{\"S\":\"migrate\"},\"current\":{\"BOOL\":${TOGGLE}}}"
