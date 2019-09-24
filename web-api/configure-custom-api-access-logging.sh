#!/bin/bash

if [ "$#" -ne 3 ] || ! [ -f "$2" ]; then
  echo "Usage: $0 [stage_name] [config_file_name] [region]" >&2
  exit 1
fi

stage_name=$1
cli_input_json=$2
region=$3

REST_API_ID=$(aws apigateway get-rest-apis --region="${region}" --query "items[?name=='${stage_name}-ef-cms'].id" --output text)
ACCOUNT_ID=$(aws sts get-caller-identity --query "Account")
ACCOUNT_ID="${ACCOUNT_ID%\"}"
ACCOUNT_ID="${ACCOUNT_ID#\"}"

ARN="arn:aws:logs:${region}:${ACCOUNT_ID}:log-group:API-Gateway-Execution-Logs_${REST_API_ID}"

JSON=$(sed "s/update_arn/${ARN}/g" "./${cli_input_json}")

aws apigateway update-stage \
--rest-api-id "${REST_API_ID}" \
--stage-name "${stage_name}" \
--cli-input-json "${JSON}" \
--region "${region}"