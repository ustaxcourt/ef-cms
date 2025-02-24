#!/bin/bash

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <create|delete> <entity>"
  exit 1
fi

ACTION=$1
PK_SK_STRING=$2
TABLE_NAME="${DYNAMODB_TABLE_NAME}"

if [ -z "$TABLE_NAME" ]; then
  echo "Error: DYNAMODB_TABLE_NAME environment variable is not set."
  exit 1
fi

NOW=$(date +%s)
TTL=3600
TTL_EXPIRATION=$((NOW + TTL))

if [[ "$ACTION" != "create" && "$ACTION" != "delete" ]]; then
  echo "Invalid action. Use 'create' or 'delete'."
  exit 1
fi

if [ "$ACTION" == "create" ]; then
  ITEM_JSON=$(cat <<EOF
{
  "pk": { "S": "$PK_SK_STRING" },
  "sk": { "S": "lock" },
  "timestamp": { "N": "$NOW" },
  "ttl": { "N": "$TTL_EXPIRATION" }
}
EOF
)

  echo "Creating item with pk: $PK_SK_STRING, sk: 'lock', timestamp: $NOW, ttl: $TTL_EXPIRATION"
  
  if aws dynamodb put-item \
    --table-name "$TABLE_NAME" \
    --item "$ITEM_JSON" \
    --return-consumed-capacity TOTAL; then
    echo "Item created successfully."
  else
    echo "Error creating item."
    exit 1
  fi

elif [ "$ACTION" == "delete" ]; then
  echo "Deleting item with pk: $PK_SK_STRING, sk: 'lock'"

  if aws dynamodb delete-item \
    --table-name "$TABLE_NAME" \
    --key "{\"pk\": {\"S\": \"$PK_SK_STRING\"}, \"sk\": {\"S\": \"lock\"}}"; then
    echo "Item deleted successfully."
  else
    echo "Error deleting item."
    exit 1
  fi
fi
