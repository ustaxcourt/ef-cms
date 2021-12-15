#!/bin/bash

# Sets the document search limiter values in the deploy table

# Usage
#   ./setup-document-search-limiter.sh dev

# Arguments
#   - $1 - the environment to setup

[ -z "$1" ] && echo "The environment must be provided as the \$1 argument." && exit 1

ENV=$1

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

