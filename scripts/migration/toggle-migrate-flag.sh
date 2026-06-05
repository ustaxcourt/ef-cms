#!/usr/bin/env bash

./check-env-variables.sh \
  "ENV" \
  "AWS_ACCOUNT_ID" \
  "AWS_SECRET_ACCESS_KEY"

TOGGLE="false"
if [[ -n "$1" ]] && { [[ "$1" == "on" ]] || [[ "$1" == "ON" ]] || [[ "$1" == "-on" ]] || [[ "$1" == "--on" ]]; }; then
    TOGGLE="true"
fi

aws ssm put-parameter \
	--region us-east-1 --name "/DAWSON/${ENV}/migrate" \
	--value "$TOGGLE" \
	--type "String" \
	--overwrite
