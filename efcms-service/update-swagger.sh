#!/usr/bin/env bash
# This script parses the serverless.yml file to determine the name
# of the apigateway resource that was deployed, and then uses that
# to fetch the apigateway ID from aws.  Using that ID, this script is then
# able to download the swagger.json from the deployed aws apigateway.

STAGE=$1
REGION=$2

API_ID=$(aws apigateway get-rest-apis --query "items[?name=='${STAGE}-ef-cms'].id" --output text)

outputFileName=swagger.json

aws apigateway get-export \
  --rest-api-id="${API_ID}" \
  --stage-name="${STAGE}" \
  --export-type=swagger \
  --accept=application/json \
  --region="${REGION}" \
  $outputFileName