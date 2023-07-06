#!/bin/bash

# Sets the external opinion search enabled flag to "true" in the dynamo deploy table

# Usage
#   ENV=dev ./setup-add-docket-numbers-to-orders-flag.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

ITEM=$(cat <<-END
{
    "pk": {
        "S": "consolidated-cases-add-docket-numbers"
    },
    "sk":{
        "S": "consolidated-cases-add-docket-numbers"
    },
    "current": {
        "BOOL": true
    }
}
END
)

aws dynamodb put-item \
    --region us-east-1 \
    --table-name "efcms-deploy-${ENV}" \
    --item "${ITEM}"

