#!/bin/bash

# Writes a record that will indicate to the streams lambda that migration writes have finished indexing

# Usage
#   ./scripts/dynamo/set-migration-complete-marker.sh

./check-env-variables.sh \
  "AWS_ACCESS_KEY_ID" \
  "AWS_SECRET_ACCESS_KEY" \
  "CIRCLE_MACHINE_USER_TOKEN" \
  "CIRCLE_WORKFLOW_ID" \
  "ENV" \
  "JOB_NAME" \
  "SOURCE_TABLE"

NOW=$(date -u "+%Y-%m-%dT%H:%M:%SZ")
TOMORROW=$(($(date "+%s") + 86400))

ITEM=$(cat <<-END
{
    "pk": {
        "S": "completion-marker"
    },
    "sk":{
        "S": "completion-marker|${CIRCLE_WORKFLOW_ID}"
    },
    "completedAt": {
        "S": "${NOW}"
    },
    "apiToken": {
        "S": "${CIRCLE_MACHINE_USER_TOKEN}"
    },
    "entityName": {
        "S": "CompletionMarker"
    },
    "environment": {
        "S": "${ENV}"
    },
    "jobName": {
        "S": "${JOB_NAME}"
    },
    "workflowId": {
        "S": "${CIRCLE_WORKFLOW_ID}"
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
