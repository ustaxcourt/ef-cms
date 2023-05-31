#!/bin/bash

# Returns if the puppeteer layers should be attached to all the lambdas

# Usage
#   ./get-deploying-use-layers.sh dev

# Arguments
#   - $1 - the environment to check

( ! command -v jq > /dev/null ) && echo "jq must be installed on your machine." && exit 1
[ -z "$1" ] && echo "The env to check must be provided as the \$1 argument." && exit 1

ENV=$1

DEPLOYING_USE_LAYERS=$(aws dynamodb get-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --key '{"pk":{"S":"deploying-use-layers"},"sk":{"S":"deploying-use-layers"}}' | jq -r ".Item.current.BOOL")

echo "${DEPLOYING_USE_LAYERS}"
