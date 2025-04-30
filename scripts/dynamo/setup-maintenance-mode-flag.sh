#!/bin/bash

# creates the entry for maintenance mode flag in the dynamo deploy table

# Usage
#   ENV=dev ./setup-maintenance-mode-flag.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

ITEM=$(cat <<-END
{
    "pk": {
        "S": "maintenance-mode"
    },
    "sk":{
        "S": "maintenance-mode"
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
