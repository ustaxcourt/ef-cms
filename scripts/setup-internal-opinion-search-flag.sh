#!/bin/bash

# Sets the internal opinion search enabled flag to "true" in the dynamo deploy table

# Usage
#   ./setup-internal-opinion-search-flag.sh dev

# Arguments
#   - $1 - the environment to set the flag

[ -z "$1" ] && echo "The environment must be provided as the \$1 argument." && exit 1

ENV=$1

ITEM=$(cat <<-END
{
    "pk": {
        "S": "internal-opinion-search-enabled"
    },
    "sk":{
        "S":"internal-opinion-search-enabled"
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

