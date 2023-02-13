#!/bin/bash

# Sets the UPDATED_TRIAL_STATUS_TYPES enabled flag to "false" in the dynamo deploy table

# Usage
#   ENV=dev ./setup-updated-trial-session-types-flag.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

ITEM=$(cat <<-END
{
    "pk": {
        "S": "updated-trial-status-types"
    },
    "sk":{
        "S": "updated-trial-status-types"
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

