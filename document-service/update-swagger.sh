#!/usr/bin/env bash
# This script parses the serverless.yml file to determine the name
# of the apigateway resource that was deployed, and then uses that
# to fetch the apigateway ID from aws.  Using that ID, this script is then
# able to download the swagger.json from the deployed aws apigateway.

# requires python
# install jq
# require YQ to be installed
#   pip install yq
STAGE=$1
REGION=$2
NAME=$(yq -r .service < serverless.yml)
FULL_NAME="$STAGE-$NAME"
API_ID=$(aws apigateway get-rest-apis --output=json --region="${REGION}" | jq -r ".items[] | select(.name == \"${FULL_NAME}\") | .id")
outputFileName=swagger.json

aws apigateway get-export \
  --rest-api-id="${API_ID}" \
  --stage-name="${STAGE}" \
  --export-type=swagger \
  --accept=application/json \
  --region="${REGION}" \
  $outputFileName