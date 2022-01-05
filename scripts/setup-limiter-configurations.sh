#!/bin/bash

[ -z "$1" ] && echo "The environment must be provided as the \$1 argument." && exit 1

ENV=$1

ITEM=$(cat <<-END
{
    "pk": {
        "S": "document-search-limiter-configuration"
    },
    "sk":{
        "S": "document-search-limiter-configuration"
    },
    "windowTime": {
        "N": "5000"
    },
    "maxInvocations": {
        "N": "5"
    }
}
END
)

aws dynamodb put-item \
    --region us-east-1 \
    --table-name "efcms-deploy-${ENV}" \
    --item "${ITEM}"

