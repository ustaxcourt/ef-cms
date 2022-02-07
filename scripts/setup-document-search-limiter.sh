#!/bin/bash

# Sets the document search limiter values in the deploy table

# Usage
#  ENV=dev ./setup-document-search-limiter.sh


./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

ITEM=$(cat <<-END
{
    "pk": {
        "S": "document-search-limiter-configuration"
    },
    "sk":{
        "S":"document-search-limiter-configuration"
    },
    "maxInvocations": {
        "NUMBER": 5
    },
    "windowTime": {
        "NUMBER": 1000
    }
}
END
)

aws dynamodb put-item \
    --region us-east-1 \
    --table-name "efcms-deploy-${ENV}" \
    --item "${ITEM}"

