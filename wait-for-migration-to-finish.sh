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

fail_on_dlq () {
  response=$(aws sqs get-queue-attributes --attribute-names ApproximateNumberOfMessages ApproximateNumberOfMessagesNotVisible ApproximateNumberOfMessagesDelayed --queue-url="https://sqs.us-east-1.amazonaws.com/${AWS_ACCOUNT_ID}/migration_segments_dl_queue_${ENV}" --region us-east-1 --query "Attributes" --output=text)
  local total=0
  for count in $response
    do
      total=$(( $total + $count ))
    done

  if [[ "$total" != "0" ]]; then
    echo "There are messages in the migration_segments_dl_queue_${ENV} queue"
    exit 1
  fi
}

fail_on_segments_error_count () {
  # check the past 15 minutes of cloudwatch metrics for invocation and error count and calculate a percentage
  # anything greater than 50% should probably be considered a failed migration
  start=$(node -e 'var d = new Date(); d.setTime(d.getTime() - (60 * 15000)); console.log(d.toISOString())')
  end=$(node -e 'var d = new Date(); d.setTime(d.getTime()); console.log(d.toISOString())')
  errorResponse=$(aws cloudwatch get-metric-statistics --metric-name Errors --namespace AWS/Lambda --statistics Sum --start-time $start --end-time $end --period 60 --dimensions Name=FunctionName,Value=migration_segments_lambda_${ENV} --query "Datapoints[].Sum" --output=text --region us-east-1)
  invocationsResponse=$(aws cloudwatch get-metric-statistics --metric-name Invocations --namespace AWS/Lambda --statistics Sum --start-time $start --end-time $end --period 60 --dimensions Name=FunctionName,Value=migration_segments_lambda_${ENV} --query "Datapoints[].Sum" --output=text --region us-east-1)

  local errorTotal=0
  for count in $errorResponse
    do
      intCount=$(printf "%.0f\n" $count)
      errorTotal=$(( $errorTotal + $intCount ))
    done
  
  local invocationTotal=0
  for count in $invocationsResponse
    do
      intCount=$(printf "%.0f\n" $count)
      invocationTotal=$(( $invocationTotal + $intCount ))
    done

  if [[ "$errorTotal" -gt "0" ]] && [[ "$invocationTotal" -gt "0" ]]; then
    echo "There were $errorTotal errors in the last 15 minutes"
    echo "There were $invocationTotal invocations in the last 15 minutes"
    local failurePercentage=$(( $errorTotal * 100 / $invocationTotal ))
    echo "There were $failurePercentage% errors in the last 15 minutes"

    if [ $failurePercentage -gt 50 ]; then
      exit 1
    fi
  fi
}

sleep 5
while true
do
  fail_on_dlq
  fail_on_segments_error_count
  total=$(get_total)

  if [ "${total}" == 0 ]
  then
    sleep 120 # wait two minutes and re-check for consistency
    fail_on_dlq
    fail_on_segments_error_count
    recheck=$(get_total)
    if [ "${recheck}" == 0 ]
    then
      break
    fi
  fi

  sleep 5
done
