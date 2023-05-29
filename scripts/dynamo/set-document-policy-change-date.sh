#!/bin/bash

# Sets the document visibility policy change date to the passed in value in the dynamo deploy table

# Usage
#   ./set-document-policy-change-date.sh 2023-08-01 dev

# Arguments
#   - $1 - date to use as the effective policy change date
#   - $2 - the environment to set the flag

[ -z "$1" ] && echo "The value to set for the maintenance mode flag must be provided as the \$1 argument." && exit 1
[ -z "$2" ] && echo "The environment must be provided as the \$2 argument." && exit 1

DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE=$1
ENV=$2

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
        "S": "${DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE}"
    }
}
END
)

aws dynamodb put-item \
    --region us-east-1 \
    --table-name "efcms-deploy-${ENV}" \
    --item "${ITEM}"
