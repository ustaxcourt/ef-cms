#!/bin/bash

# Returns the migration destination table for the environment

# Usage
#   ./get-destination-table.sh dev

# Arguments
#   - $1 - the environment to check

[ -z "$1" ] && echo "The env to check must be provided as the \$1 argument." && exit 1

ENV=$1

DESTINATION_TABLE_VERSION=$(aws ssm get-parameter --region us-east-1 --name "/DAWSON/${ENV}/destination-table-version" --query "Parameter.Value" --output text)

if [ -z "$DESTINATION_TABLE_VERSION" ]; then
  echo "efcms-${ENV}"
else
  echo "efcms-${ENV}-${DESTINATION_TABLE_VERSION}"
fi
