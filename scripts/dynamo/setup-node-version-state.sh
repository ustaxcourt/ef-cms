#!/bin/bash

# Sets the node version values in the dynamo deploy table

# Usage
#   ENV=dev ./setup-node-version-state.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

ITEM=$(cat <<-END
{
    "pk": {
        "S": "deploying-node-version"
    },
    "sk":{
        "S": "deploying-node-version"
    },
    "current": {
        "S": "nodejs18.x"
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
        "S": "current-node-version"
    },
    "sk":{
        "S": "current-node-version"
    },
    "current": {
        "S": "nodejs16.x"
    }
}
END
)

aws dynamodb put-item \
    --region us-east-1 \
    --table-name "efcms-deploy-${ENV}" \
    --item "${ITEM}"
