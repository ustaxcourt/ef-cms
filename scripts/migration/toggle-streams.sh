#!/bin/bash

./check-env-variables.sh \
  "ENV" \
  "AWS_ACCOUNT_ID" \
  "AWS_SECRET_ACCESS_KEY"

TOGGLE="--no-enabled"
if [[ -n "$1" ]] && { [[ "$1" == "on" ]] || [[ "$1" == "ON" ]] || [[ "$1" == "-on" ]] || [[ "$1" == "--on" ]]; }; then
    TOGGLE="--enabled"
fi

REGIONS="us-west-1 us-east-1"
COLORS="blue green"
for region in $REGIONS; do
  for color in $COLORS; do
    STREAM_ID=$(aws lambda list-event-source-mappings --function-name "arn:aws:lambda:${region}:${AWS_ACCOUNT_ID}:function:streams_${ENV}_${color}" --region "$region" | jq -r ".EventSourceMappings[0].UUID")
    [ -n "$STREAM_ID" ] && aws lambda update-event-source-mapping --uuid "$STREAM_ID" --region "$region" "$TOGGLE"
  done
done
