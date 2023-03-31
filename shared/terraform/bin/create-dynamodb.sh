#!/bin/bash
# creates a dynamodb table to manage locks on terraform state

NAME=$1
if [ -z "${NAME}" ]
then
      echo "You must provide a table name when calling this script"
      exit 1
fi

REGION=$2
if [ -z "${REGION}" ]
then
      echo "You must provide a region when calling this script"
      exit 1
fi

aws dynamodb create-table \
  --table-name "${NAME}" \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
  --region "${REGION}"
