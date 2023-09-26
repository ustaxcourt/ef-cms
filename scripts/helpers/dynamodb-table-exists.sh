#!/bin/bash -e

function check_dynamo_table_exists() {
  TABLE_NAME=$1
  REGION=$2

  aws dynamodb describe-table --table-name "${TABLE_NAME}" --region "${REGION}" > /dev/null 2>&1
  CODE=$?
  if [[ "${CODE}" == "0" ]]; then
    echo 1
  else
    echo 0
  fi
}
