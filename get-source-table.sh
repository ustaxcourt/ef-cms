#!/bin/bash

# Returns the migration source table for the environment

# Usage
#   ./get-source-table.sh dev

# Arguments
#   - $1 - the environment to check

[ -z "$1" ] && echo "The env to check must be provided as the \$1 argument." && exit 1

ENV=$1

EXISTS=$(aws dynamodb list-tables --region us-east-1 | grep efcms-deploy-${ENV} | wc -l)

if [ "${EXISTS}" -eq "1" ]; then
  SOURCE_TABLE_VERSION=$(aws dynamodb get-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --key '{"pk":{"S":"source-table-version"},"sk":{"S":"source-table-version"}}' | jq -r ".Item.current.S")
  [ -z "$SOURCE_TABLE_VERSION" ] && echo "efcms-${ENV}-alpha" && exit 

  echo "efcms-${ENV}-${SOURCE_TABLE_VERSION}"
else
  echo "efcms-${ENV}-alpha"
fi
