#!/bin/bash

# Sets the external order search enabled flag to "true" in the dynamo deploy table

# Usage
#   ./setup-external-order-search-flag.sh dev

# Arguments
#   - $1 - the environment to set the flag

[ -z "$1" ] && echo "The environment must be provided as the \$1 argument." && exit 1

ENV=$1

aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"external-order-search-enabled"},"sk":{"S":"external-order-search-enabled"},"current":{"BOOL":true}}'

