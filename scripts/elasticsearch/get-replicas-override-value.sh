#!/bin/bash

# Returns the number of replicas to use in the opensearch domain for the environment
# defaults to 0

# Usage
#   ./get-replicas-override-value.sh dev

# Arguments
#   - $1 - the environment to check

( ! command -v jq > /dev/null ) && echo "jq must be installed on your machine." && exit 1
[ -z "$1" ] && echo "The env to check must be provided as the \$1 argument." && exit 1

ENV=$1

OVERRIDE_ES_NUMBER_OF_REPLICAS=$(aws dynamodb get-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --key '{"pk":{"S":"opensearch-replicas-override"},"sk":{"S":"opensearch-replicas-override"}}' | jq -r ".Item.current.S")

if [ -z "$OVERRIDE_ES_NUMBER_OF_REPLICAS" ]; then
  echo "0"
else
  echo "${OVERRIDE_ES_NUMBER_OF_REPLICAS}"
fi
