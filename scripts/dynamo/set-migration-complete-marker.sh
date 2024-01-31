#!/bin/bash

# Writes a record that will indicate to the streams lambda that migration writes have finished indexing

# Usage
#   ./scripts/dynamo/set-migration-complete-marker.sh

./check-env-variables.sh \
  "AWS_ACCESS_KEY_ID" \
  "AWS_SECRET_ACCESS_KEY" \
  "ENV"

NOW=$(date -u "+%Y-%m-%dT%H:%M:%SZ")
TOMORROW=$(($(date "+%s") + 86400))

ITEM=$(cat <<-END
{
    "pk": {
        "S": "migration-complete"
    },
    "sk":{
        "S": "migration-complete"
    },
    "completedAt": {
        "S": "${NOW}"
    },
    "ttl": {
        "N": "${TOMORROW}"
    }
}
END
)

aws dynamodb put-item \
  --region us-east-1 \
  --table-name "$SOURCE_TABLE" \
  --item "$ITEM"
