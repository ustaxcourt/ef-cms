#!/bin/bash

# This script waits for the migration queue to be empty

# Usage
#   wait-for-migration-to-finish.sh

# Requirements
#   - aws must be installed on your machine

get_total () {
  response=$(aws sqs get-queue-attributes --attribute-names ApproximateNumberOfMessages ApproximateNumberOfMessagesNotVisible ApproximateNumberOfMessagesDelayed --queue-url="https://sqs.us-east-1.amazonaws.com/${AWS_ACCOUNT_ID}/migration_segments_queue_${ENV}" --region us-east-1 --query "Attributes" --output=text)
    
  local total=0
  for count in $response
    do
      total=$(( $total + $count ))
    done
  echo "$total"
}

sleep 5
while true
do
  
  total=$(get_total)

  if [ "${total}" == 0 ]
  then
    sleep 120 # wait two minutes and re-check for consistency
    recheck=$(get_total)
    if [ "${recheck}" == 0 ]
    then
      break
    fi
  fi

  sleep 5
done
