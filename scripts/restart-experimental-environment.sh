#!/bin/bash -e

export ENV=$1
export REGION=us-east-1

# Getting the account-wide deployment settings and injecting them into the shell environment
. ./scripts/load-environment-from-secrets.sh
export SECRETS_LOADED=true

# Setting up calculated environment variables
export DESTINATION_TABLE=$(./scripts/dynamo/get-destination-table.sh $ENV)
## we use the current-color from dynamo but name the variable DEPLOYING_COLOR since it's needed in the import judge script
export DEPLOYING_COLOR=$(aws dynamodb get-item \
 --region us-east-1 \
 --table-name "efcms-deploy-${ENV}" \
 --key '{"pk":{"S":"current-color"},"sk":{"S":"current-color"}}' | jq -r ".Item.current.S")
export FILE_NAME=./scripts/data-import/judge/judge_users.csv

./check-env-variables.sh \
  "ENV" \
  "DESTINATION_TABLE" \
  "USTC_ADMIN_PASS" \
  "USTC_ADMIN_USER" \
  "REGION" \
  "FILE_NAME" \
  "DEFAULT_ACCOUNT_PASS" \
  "DEPLOYING_COLOR" \

export CI=true

# Deploying the API because this is what creates the elasticsearch domains we need as the first step
npm run deploy:api ${ENV}

# Setting up indices
./web-api/setup-elasticsearch-index.sh "${ENV}"

# Indexing data
node ./web-api/reindex-dynamodb-records.js "${DESTINATION_TABLE}"

# Setting up users
node shared/admin-tools/user/setup-admin.js
. ./shared/admin-tools/user/setup-test-users.sh ${ENV}

# Setting up Judge users
./scripts/data-import/judge/bulk-import-judge-users.sh

unset CI
unset SECRETS_LOADED
