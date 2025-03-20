#!/bin/bash

# creates the entry for minimum time for sequence performance logging in the dynamo deploy table

# Usage
#   ENV=dev ./setup-sequence-performance-minimum-time.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

ITEM=$(cat <<-END
{
    "pk": {
        "S": "sequence-performance-minimum-time"
    },
    "sk":{
        "S": "sequence-performance-minimum-time"
    },
    "current": {
        "N": "5"
    }
}
END
)

aws dynamodb put-item \
    --region us-east-1 \
    --table-name "efcms-deploy-${ENV}" \
    --item "${ITEM}"
