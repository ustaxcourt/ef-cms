#!/bin/bash

# Sets the pdfjs-express-viewer-enabled flag to "true" in the dynamo deploy table

# Usage
#   ./setup-pdfjs-express-viewer-flag.sh dev

# Arguments
#   - $1 - the environment to set the flag

[ -z "$1" ] && echo "The environment must be provided as the \$1 argument." && exit 1

ENV=$1

ITEM=$(cat <<-END
{
    "pk": {
        "S": "pdfjs-express-viewer-enabled"
    },
    "sk":{
        "S": "pdfjs-express-viewer-enabled"
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
