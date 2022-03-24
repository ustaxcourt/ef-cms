#!/bin/bash

# Sets the value for the request limit of the IP limiter

# Usage
#   ENV=dev ./setup-terminal-ip-allowlist.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

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
