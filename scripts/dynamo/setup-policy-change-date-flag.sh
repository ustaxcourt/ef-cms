#!/bin/bash

# Sets the DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE flag to a date in the dynamo deploy table

# Usage
#   ENV=dev ./setup-policy-change-date-flag.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

ITEM=$(cat <<-END
{
    "pk": {
        "S": "document-visibility-policy-change-date"
    },
    "sk":{
        "S": "document-visibility-policy-change-date"
    },
    "current": {
        "S": "2023-08-01T04:00:00.000Z"
    }
}
END
)

aws dynamodb put-item \
    --region us-east-1 \
    --table-name "efcms-deploy-${ENV}" \
    --item "${ITEM}"

