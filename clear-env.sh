#!/bin/bash -e

# Deletes existing cases from DynamoDB and ElasticSearch

# Usage
#   ./clear-env.sh $ENV

# Requirements
#   - terraform must be installed on your machine
#   - aws cli must be installed on your machine
#   - aws credentials must be setup on your machine
#   - node must be setup on your machine

# Arguments
#   - $1 - the environment to clear
#   - $2 - the dynamo table name to clear
#   - $3 - the elasticsearch endpoint to clear

./check-env-variables.sh \
  "USTC_ADMIN_PASS" \
  "AWS_ACCESS_KEY_ID" \
  "AWS_SECRET_ACCESS_KEY" \
  "DEFAULT_ACCOUNT_PASS" \
  "ENV" \
  "DYNAMODB_TABLE_NAME" \
  "ELASTICSEARCH_ENDPOINT"

$(which terraform) > /dev/null
if [[ "$?" == "1" ]]; then
  echo "Terraform was not found on your path. Please install terraform."
  exit 1
fi

./web-api/clear-elasticsearch-index.sh $ENV $ELASTICSEARCH_ENDPOINT
./web-api/setup-elasticsearch-index.sh $ENV

pushd web-api
node clear-dynamodb-table.js $DYNAMODB_TABLE_NAME
./setup-cognito-users.sh $ENV
node shared/admin-tools/user/setup-test-users.js
popd
