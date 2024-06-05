#!/bin/bash

# creates the entry for the updated petition flow flag in the dynamo deploy table

# Usage
#   ENV=dev ./setup-updated-petition-flow-flag.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

ITEM=$(cat <<-END
{
    "pk": {
        "S": "updated-petition-flow"
    },
    "sk":{
        "S": "updated-petition-flow"
    },
    "current": {
        "BOOL": false
    }
}
END
)

aws dynamodb put-item \
    --region us-east-1 \
    --table-name "efcms-deploy-${ENV}" \
    --item "${ITEM}"
