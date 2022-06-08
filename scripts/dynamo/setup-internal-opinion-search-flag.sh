#!/bin/bash

# Sets the internal opinion search enabled flag to "true" in the dynamo deploy table

# Usage
#   ENV=dev ./setup-internal-opinion-search-flag.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

ITEM=$(cat <<-END
{
    "pk": {
        "S": "internal-opinion-search-enabled"
    },
    "sk":{
        "S": "internal-opinion-search-enabled"
    },
    "current": {
        "BOOL":true
    }
}
END
)

aws dynamodb put-item \
    --region us-east-1 \
    --table-name "efcms-deploy-${ENV}" \
    --item "${ITEM}"

