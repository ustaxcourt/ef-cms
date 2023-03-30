#!/bin/bash -e

./check-env-variables.sh \
  "ENV" \
  "AWS_ACCOUNT_ID" \
  "AWS_SECRET_ACCESS_KEY" \
  "REGION"

TOGGLE="--no-enabled"
if [[ -n "$1" ]] && { [[ "$1" == "on" ]] || [[ "$1" == "ON" ]] || [[ "$1" == "-on" ]] || [[ "$1" == "--on" ]]; }; then
    TOGGLE="--enabled"
fi
STREAMS_BLUE_ID=$(aws lambda list-event-source-mappings --function-name "arn:aws:lambda:${REGION}:${AWS_ACCOUNT_ID}:function:streams_${ENV}_blue" --region "$REGION" | jq -r ".EventSourceMappings[0].UUID")
STREAMS_GREEN_ID=$(aws lambda list-event-source-mappings --function-name "arn:aws:lambda:${REGION}:${AWS_ACCOUNT_ID}:function:streams_${ENV}_green" --region "$REGION" | jq -r ".EventSourceMappings[0].UUID")
[ -n "$STREAMS_BLUE_ID" ] && aws lambda update-event-source-mapping --uuid "$STREAMS_BLUE_ID" --region "$REGION" "$TOGGLE"
[ -n "$STREAMS_GREEN_ID" ] && aws lambda update-event-source-mapping --uuid "$STREAMS_GREEN_ID" --region "$REGION" "$TOGGLE"
