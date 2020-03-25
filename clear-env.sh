#!/bin/bash

# usage:
#   ./clear-env.sh $ENV
#   where $ENV is dev|stg|prod|test|...

if [[ -z "${USTC_ADMIN_PASS}" ]]; then
  echo "You must have USTC_ADMIN_PASS set in your environment"
  exit 1
fi

$(which terraform) > /dev/null
if [[ "$?" == "1" ]]; then
  echo "Terraform was not found on your path. Please install terraform."
  exit 1
fi

./web-api/clear-elasticsearch-index.sh $1
./web-api/setup-elasticsearch-index.sh $1

pushd web-api
node clear-dynamodb-table.js $1
./setup-cognito-users.sh $1
./setup-court-users.sh $1
popd
