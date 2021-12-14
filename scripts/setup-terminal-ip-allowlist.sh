#!/bin/bash

# Sets the value for the request limit of the IP limiter

# Usage
#   ./setup-terminal-ip-allowlist.sh dev

# Arguments
#   - $1 - the environment to set the flag

[ -z "$1" ] && echo "The environment must be provided as the \$1 argument." && exit 1

ENV=$1

ITEM=$(cat <<-END
{
  "ips": {
    "L": []
  },
  "pk": {
    "S": "allowed-terminal-ips"
  },
  "sk": {
    "S": "allowed-terminal-ips"
  }
}
END
)

aws dynamodb put-item \
    --region us-east-1 \
    --table-name "efcms-deploy-${ENV}" \
    --item "${ITEM}"
