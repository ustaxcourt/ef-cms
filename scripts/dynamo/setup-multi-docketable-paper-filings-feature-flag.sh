#!/bin/bash

# Sets up a feature flag for multi-docketable paper filings (#9493), when this
# script runs it will initialize the feature as disabled for the specified env

# Usage
#   ENV=dev ./setup-multi-docketable-paper-filings-feature-flag.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

ITEM=$(cat <<-END
{
    "pk": {
        "S": "multi-docketable-paper-filings"
    },
    "sk":{
        "S": "multi-docketable-paper-filings"
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

