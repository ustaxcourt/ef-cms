#!/bin/bash

# Sets the pdfjs-express-viewer-enabled flag to "true" in the dynamo deploy table

# Usage
#   ENV=dev ./setup-pdfjs-express-viewer-flag.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

ITEM=$(cat <<-END
{
    "pk": {
        "S": "pdfjs-express-viewer-enabled"
    },
    "sk":{
        "S": "pdfjs-express-viewer-enabled"
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
