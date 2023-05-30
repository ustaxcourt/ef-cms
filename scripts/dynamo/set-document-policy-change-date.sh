#!/bin/bash

# Sets the document visibility policy change date to the passed in value in the dynamo deploy table. 

# Usage
#   ./set-document-policy-change-date.sh 2023-08-01 dev

# Arguments
#   - $1 - the environment to set the flag
#   - $2 - date to use as the effective policy change date. Defaults to 2023-08-01 (date chosen by court) if this value is not passed in

[ -z "$1" ] && echo "The environment must be provided as the \$1 argument." && exit 1

ENV=$1
DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE=$2

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

if [[ -z $DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE ]] ; then
    DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE="2023-08-01"
fi


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
