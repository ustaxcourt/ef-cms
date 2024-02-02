#!/bin/bash

( ! command -v jq > /dev/null ) && echo "jq must be installed on your machine." && exit 1
[ -z "${ENV}" ] && echo "You must have ENV set in your environment" && exit 1
[ -z "${AWS_ACCOUNT_ID}" ] && echo "You must have AWS_ACCOUNT_ID set in your environment" && exit 1
[ -z "${DEPLOYING_COLOR}" ] && echo "You must have DEPLOYING_COLOR set in your environment" && exit 1

UUID=$(aws lambda list-event-source-mappings --function-name "arn:aws:lambda:us-east-1:${AWS_ACCOUNT_ID}:function:streams_${ENV}_${DEPLOYING_COLOR}" --region us-east-1 | jq -r ".EventSourceMappings[0].UUID")
aws lambda update-event-source-mapping --uuid "${UUID}" --region us-east-1 --enabled

BEGIN=$(date -u "+%s")
ELAPSED='0'
STATE=$(aws lambda get-event-source-mapping --uuid "${UUID}" --region us-east-1 --query "State" --output text)

while [[ "$STATE" != "Enabled" ]] || [[ "$ELAPSED" -gt 120 ]]; do
  sleep 2
  STATE=$(aws lambda get-event-source-mapping --uuid "${UUID}" --region us-east-1 --query "State" --output text)
  ELAPSED=$(($(date -u "+%s") - "$BEGIN"))
done

echo "${ENV}'s ${DEPLOYING_COLOR} dynamo stream is now: ${STATE}"

[[ "$STATE" != "Enabled" ]] && exit 1
