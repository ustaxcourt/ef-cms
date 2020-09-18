#!/bin/bash

# This script waits for the migration queue to be empty

# Usage
#   wait-for-migration-to-finish.sh

# Requirements
#   - aws must be installed on your machine

sleep 5
while true
do
  response=$(aws sqs get-queue-attributes --attribute-names=ApproximateNumberOfMessages --queue-url="https://sqs.us-east-1.amazonaws.com/${AWS_ACCOUNT_ID}/migration_segments_queue_${ENV}" --region us-east-1 --query "Attributes.ApproximateNumberOfMessages" --output=text)

  if [ "${response}" == "0" ]
  then
    break
  fi

  sleep 5
done
