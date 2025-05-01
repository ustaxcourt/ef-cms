#!/bin/bash

# Returns the migration source table for the environment

# Usage
#   ./get-source-table.sh dev

# Arguments
#   - $1 - the environment to check
[ -z "$1" ] && echo "The env to check must be provided as the \$1 argument." && exit 1

ENV=$1

SOURCE_TABLE_VERSION=$(aws ssm get-parameter --region us-east-1 --name "/efcms-deploy/${ENV}/source-table-version" --with-decryption --query "Parameter.Value" --output text 2>/dev/null)
[ -z "$SOURCE_TABLE_VERSION" ] && echo "efcms-${ENV}" && exit

echo "efcms-${ENV}-${SOURCE_TABLE_VERSION}"
