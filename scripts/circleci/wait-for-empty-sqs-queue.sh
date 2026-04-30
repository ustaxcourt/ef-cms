#!/bin/bash -e

./check-env-variables.sh \
  "AWS_ACCESS_KEY_ID" \
  "AWS_ACCOUNT_ID" \
  "AWS_SECRET_ACCESS_KEY" \
  "CURRENT_COLOR" \
  "ENV" \
  "REGION"

QUEUE_URL="https://sqs.${REGION}.amazonaws.com/${AWS_ACCOUNT_ID}/change_of_address_queue_${ENV}_${CURRENT_COLOR}"
POLL_INTERVAL="${1:-30}"
MAX_WAIT="${2:-3600}"

( ! command -v jq > /dev/null ) && echo "jq must be installed on your machine." && exit 1
echo "Waiting for SQS queue to drain: ${QUEUE_URL}"

elapsed=0
while true; do
  ATTRIBUTES=$(aws sqs get-queue-attributes \
    --queue-url "${QUEUE_URL}" \
    --attribute-names ApproximateNumberOfMessages ApproximateNumberOfMessagesNotVisible \
    --region "${REGION}" \
    --output json)

  VISIBLE=$(echo "${ATTRIBUTES}" | jq -r '.Attributes.ApproximateNumberOfMessages')
  NOT_VISIBLE=$(echo "${ATTRIBUTES}" | jq -r '.Attributes.ApproximateNumberOfMessagesNotVisible')

  echo "Messages visible: ${VISIBLE}, in-flight: ${NOT_VISIBLE}"

  if [[ "${VISIBLE}" == "0" ]] && [[ "${NOT_VISIBLE}" == "0" ]]; then
    echo "Queue is empty!"
    exit 0
  fi

  if [[ "${elapsed}" -ge "${MAX_WAIT}" ]]; then
    echo "Timed out waiting for queue to drain after ${MAX_WAIT} seconds"
    exit 1
  fi

  echo "Queue not empty. Waiting ${POLL_INTERVAL} seconds before checking again..."
  sleep "${POLL_INTERVAL}"
  elapsed=$((elapsed + POLL_INTERVAL))
done
