#!/bin/bash

ENVIRONMENT=$1
if [ -z "${ENVIRONMENT}" ]
then
      echo "You must provide an environment name when calling this script"
      exit 1
fi

DEPLOYMENT_NAME=$2
if [ -z "${DEPLOYMENT_NAME}" ]
then
      echo "You must provide a deployment name when calling this script"
      exit 1
fi

REGION=$3
if [ -z "${REGION}" ]
then
      echo "You must provide a region when calling this script"
      exit 1
fi

KEY=$4
if [ -z "${KEY}" ]
then
      echo "You must provide a key to be used as an identifier for deployment state"
      exit 1
fi

bucket=${DEPLOYMENT_NAME}-${ENVIRONMENT}-deployment

echo "Initiating provisioning for environment [${ENVIRONMENT}] in AWS region [${REGION}]"

sh create-bucket.sh "${bucket}" "${KEY}" "${REGION}"
sh create-dynamodb.sh "${DEPLOYMENT_NAME}-${ENVIRONMENT}-terraform-lock" "${REGION}"