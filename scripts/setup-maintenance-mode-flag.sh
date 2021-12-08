#!/bin/bash

# creates the entry for maintenance mode flag in the dynamo deploy table

# Usage
#   ./setup-maintenance-mode-flag.sh dev

# Arguments
#   - $1 - the environment to set the flag

[ -z "$1" ] && echo "The environment must be provided as the \$1 argument." && exit 1

ENV=$1

ITEM=$(cat <<-END
{
    "pk": {
        "S": "maintenance-mode"
    },
    "sk":{
        "S": "maintenance-mode"
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
