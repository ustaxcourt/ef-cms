#!/bin/bash -e

ENV=$1
export REGION=us-east-1

# Deploying the API because this is what creates the elasticsearch domains we need as the first step
npm run deploy:api ${ENV}

# Getting the account-wide deployment settings and injecting them into the shell environment
. ./scripts/load-environment-from-secrets.sh

# Setting up indices
./web-api/setup-elasticsearch-index.sh "${ENV}"

## Indexing data
export DESTINATION_TABLE=$(./scripts/get-destination-table.sh $ENV)
node ./web-api/reindex-dynamodb-records.js "${DESTINATION_TABLE}"

## Setting up users
node shared/admin-tools/user/setup-admin.js
. ./shared/admin-tools/user/setup-test-users.sh ${ENV}

## we use the current-color from dynamo but name the variable DEPLOYING_COLOR since it's needed in the import judge script
export DEPLOYING_COLOR=$(aws dynamodb get-item \
 --region us-east-1 \
 --table-name "efcms-deploy-${ENV}" \
 --key '{"pk":{"S":"current-color"},"sk":{"S":"current-color"}}' | jq -r ".Item.current.S")

export FILE_NAME=./scripts/data-import/judge/judge_users.csv
./scripts/data-import/judge/bulk-import-judge-users.sh
