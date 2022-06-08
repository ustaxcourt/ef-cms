#!/bin/bash

# Sets the value for the number of days worth of items to retrieve for the section outbox

# Usage
#   ENV=dev ./setup-section-outbox-retrieval-days.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

ITEM=$(cat <<-END
{
    "pk": {
        "S": "section-outbox-number-of-days"
    },
    "sk":{
        "S": "section-outbox-number-of-days"
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
