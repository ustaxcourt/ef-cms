#!/bin/bash

# Returns if the puppeteer layers should be attached to all the lambdas

# Usage
#   ./get-current-use-layers.sh dev

# Arguments
#   - $1 - the environment to check

( ! command -v jq > /dev/null ) && echo "jq must be installed on your machine." && exit 1
[ -z "$1" ] && echo "The env to check must be provided as the \$1 argument." && exit 1

ENV=$1

CURRENT_USE_LAYERS=$(aws dynamodb get-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --key '{"pk":{"S":"current-use-layers"},"sk":{"S":"current-use-layers"}}' | jq -r ".Item.current.BOOL")

echo "${CURRENT_USE_LAYERS}"
