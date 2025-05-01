#!/bin/bash

# Updates the specified environment's deploy table after a migration

# Usage
#   ./update-deploy-table-after-migration.sh $ENV

# Arguments
#   - $1 - the env to update

[ -z "$1" ] && echo "The environment to check must be provided as the \$1 argument." && exit 1

ENV=$1

aws ssm put-parameter --region us-east-1 --name "/DAWSON/${ENV}/migrate" --value "false" --type "String" --overwrite

DESTINATION_TABLE_VERSION=$(aws ssm get-parameter --region us-east-1 --name "/DAWSON/${ENV}/destination-table-version" --query "Parameter.Value" --output text)
aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"source-table-version"},"sk":{"S":"source-table-version"},"current":{"S":"'"${DESTINATION_TABLE_VERSION}"'"}}'

