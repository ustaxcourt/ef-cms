#!/bin/bash

# Sets the use layers state in deploy table

# Usage
#   ENV=dev ./setup-use-layers-state.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

ITEM=$(cat <<-END
{
    "pk": {
        "S": "deploying-use-layers"
    },
    "sk":{
        "S": "deploying-use-layers"
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


ITEM=$(cat <<-END
{
    "pk": {
        "S": "current-use-layers"
    },
    "sk":{
        "S": "current-use-layers"
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
