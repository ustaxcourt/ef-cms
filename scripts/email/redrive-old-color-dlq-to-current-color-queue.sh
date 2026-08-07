#!/usr/bin/env bash
set -e

./check-env-variables.sh \
   "AWS_ACCOUNT_ID" \
   "CURRENT_COLOR" \
   "ENV" \
   "REGION"

[ "$CURRENT_COLOR" = "green" ] && OLD_COLOR="blue" || OLD_COLOR="green"

SOURCE_DLQ_URL="https://sqs.${REGION}.amazonaws.com/${AWS_ACCOUNT_ID}/send_emails_dl_queue_${ENV}_${OLD_COLOR}.fifo"
TARGET_QUEUE_URL="https://sqs.${REGION}.amazonaws.com/${AWS_ACCOUNT_ID}/send_emails_queue_${ENV}_${CURRENT_COLOR}.fifo"
VISIBILITY_TIMEOUT=300

# Set a group ID for the forwarded messages
MESSAGE_GROUP_ID="dlq-redrive-group"

echo "Replaying FIFO messages from ${OLD_COLOR} DLQ to ${CURRENT_COLOR} queue..."

while true; do
  # 1. Receive up to 10 messages (including FIFO attributes)
  RESPONSE=$(aws sqs receive-message \
    --queue-url "$SOURCE_DLQ_URL" \
    --max-number-of-messages 10 \
    --visibility-timeout "$VISIBILITY_TIMEOUT" \
    --attribute-names All \
    --message-attribute-names All \
    --output json)

  if [ -z "$RESPONSE" ]; then
    echo "No response received. Finished."
    break
  fi

  MESSAGES=$(echo "$RESPONSE" | jq -c '.Messages // []')
  COUNT=$(echo "$MESSAGES" | jq 'length')
  COUNT=${COUNT:-0}

  if [ "$COUNT" -eq 0 ]; then
    echo "No more visible messages in DLQ. Done!"
    break
  fi

  echo "Processing batch of $COUNT FIFO messages..."

  # 2. Format batch payload with FIFO-required parameters:
  #    - Uses existing MessageGroupId if present, otherwise falls back to MESSAGE_GROUP_ID
  #    - Uses MessageId as MessageDeduplicationId to ensure unique delivery
  BATCH_PAYLOAD=$(echo "$MESSAGES" | jq -c --arg group_id "$MESSAGE_GROUP_ID" 'map({
    Id: .MessageId,
    MessageBody: .Body,
    MessageGroupId: (.Attributes.MessageGroupId // $group_id),
    MessageDeduplicationId: .MessageId
  })')

  # 3. Send batch to the target FIFO queue
  aws sqs send-message-batch \
    --queue-url "$TARGET_QUEUE_URL" \
    --entries "$BATCH_PAYLOAD" > /dev/null

  echo "Successfully forwarded ${COUNT} messages from the ${OLD_COLOR} DLQ to the ${CURRENT_COLOR} queue."

  sleep 1
done
