#!/bin/bash

# Returns the migration elasticsearch domain for the environment

# Usage
#   ./get-destination-elasticsearch.sh dev

# Arguments
#   - $1 - the environment to check

[ -z "$1" ] && echo "The env to check must be provided as the \$1 argument." && exit 1

ENV=$1

DESTINATION_TABLE_VERSION=$(aws ssm get-parameter --region us-east-1 --name "/DAWSON/${ENV}/destination-table-version" --query "Parameter.Value" --output text)

if [ -z "$DESTINATION_TABLE_VERSION" ]; then
  echo "efcms-search-${ENV}"
else
  echo "efcms-search-${ENV}-${DESTINATION_TABLE_VERSION}"
fi
