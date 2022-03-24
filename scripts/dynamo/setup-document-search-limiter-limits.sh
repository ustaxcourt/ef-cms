#!/bin/bash

# Sets the value for the request limit of the IP limiter

# Usage
#   ENV=dev ./setup-document-search-limiter-limits.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

ITEM=$(cat <<-END
{
  "maxInvocations": {
    "N": "5"
  },
  "pk": {
    "S": "document-search-limiter-configuration"
  },
  "sk": {
    "S": "document-search-limiter-configuration"
  },
  "windowTime": {
    "N": "1000"
  }
}
END
)

aws dynamodb put-item \
    --region us-east-1 \
    --table-name "efcms-deploy-${ENV}" \
    --item "${ITEM}"
