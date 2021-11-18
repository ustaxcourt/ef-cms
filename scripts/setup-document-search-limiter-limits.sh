#!/bin/bash

# Sets the value for the request limit of the IP limiter

# Usage
#   ./setup-document-search-limiter-limits.sh dev

# Arguments
#   - $1 - the environment to set the flag

[ -z "$1" ] && echo "The environment must be provided as the \$1 argument." && exit 1

ENV=$1

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
