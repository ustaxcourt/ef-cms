#!/bin/bash

# Updates the specified environment's deploy table after a reindex

# Usage
#   ./update-deploy-table-after-reindex.sh $ENV

# Arguments
#   - $1 - the env to update

( ! command -v jq > /dev/null ) && echo "jq must be installed on your machine." && exit 1
[ -z "$1" ] && echo "The environment to check must be provided as the \$1 argument." && exit 1

ENV=$1

aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"reindex"},"sk":{"S":"reindex"},"current":{"BOOL":false}}'
