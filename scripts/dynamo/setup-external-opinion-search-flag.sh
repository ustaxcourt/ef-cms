#!/bin/bash

# Sets the external opinion search enabled flag to "true" in the dynamo deploy table

# Usage
#   ENV=dev ./setup-external-opinion-search-flag.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

ITEM=$(cat <<-END
{
    "pk": {
        "S": "external-opinion-search-enabled"
    },
    "sk":{
        "S": "external-opinion-search-enabled"
    },
    "current": {
        "BOOL":false
    }
}
END
)

aws dynamodb put-item \
    --region us-east-1 \
    --table-name "efcms-deploy-${ENV}" \
    --item "${ITEM}"

