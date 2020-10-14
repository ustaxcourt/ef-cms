#!/bin/bash

# Returns the migration destination table for the environment

# Usage
#   ./get-destination-table.sh dev

# Arguments
#   - $1 - the environment to check

[ -z "$1" ] && echo "The env to check must be provided as the \$1 argument." && exit 1

ENV=$1

DESTINATION_TABLE_VERSION=$(aws dynamodb get-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --key '{"pk":{"S":"destination-table-version"},"sk":{"S":"destination-table-version"}}' | jq -r ".Item.current.S")
[ -z "$DESTINATION_TABLE_VERSION" ] && echo "efcms-${ENV}"

echo "efcms-${ENV}-${DESTINATION_TABLE_VERSION}"
