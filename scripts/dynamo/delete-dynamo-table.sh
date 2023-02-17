#!/bin/bash

# Deletes the specified dynamo table from the environment

# Usage
#   ./delete-dynamo-table.sh $TABLE_NAME

# Arguments
#   - $1 - the table to delete

( ! command -v jq > /dev/null ) && echo "jq must be installed on your machine." && exit 1
[ -z "$1" ] && echo "The table to delete must be provided as the \$1 argument." && exit 1

TABLE_NAME=$1

aws dynamodb describe-table --table-name "${TABLE_NAME}" --region us-west-1 > /dev/null 2>&1
CODE=$?

if [[ "${CODE}" == "0" ]]; then
  aws dynamodb delete-table --table-name "${TABLE_NAME}" --region us-west-1 | jq -r ".TableDescription.TableStatus"

  while [[ "${CODE}" == "0" ]]; do  
    echo "${TABLE_NAME} in region us-west-1 is still being deleted. Waiting for 30 seconds then checking again."
    sleep 30
    aws dynamodb describe-table --table-name "${TABLE_NAME}" --region us-west-1 > /dev/null 2>&1
    CODE=$?
  done
fi

echo "${TABLE_NAME} in region us-west-1 is deleted."

aws dynamodb describe-table --table-name "${TABLE_NAME}" --region us-east-1 > /dev/null 2>&1
CODE=$?

if [[ "${CODE}" == "0" ]]; then
  aws dynamodb delete-table --table-name "${TABLE_NAME}" --region us-east-1 > /dev/null 2>&1
  CODE=$?
  while [[ "${CODE}" != "0" ]]; do
    echo "${TABLE_NAME} in region us-east-1 is replicating writes. Waiting for 30 seconds then checking again."
    sleep 30
    aws dynamodb delete-table --table-name "${TABLE_NAME}" --region us-east-1 > /dev/null 2>&1
    CODE=$?
  done

  while [[ "${CODE}" == "0" ]]; do
    echo "${TABLE_NAME} in region us-east-1 is still being deleted. Waiting for 30 seconds then checking again."
    sleep 30
    aws dynamodb describe-table --table-name "${TABLE_NAME}" --region us-east-1 > /dev/null 2>&1
    CODE=$?
  done
fi

echo "${TABLE_NAME} in region us-east-1 is deleted."
