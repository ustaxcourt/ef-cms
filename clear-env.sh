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

./web-api/clear-elasticsearch-index.sh dev
./web-api/setup-elasticsearch-index.sh dev

pushd web-api
node clear-dynamodb-table.js dev
./setup-cognito-users.sh dev
./setup-court-users.sh dev
popd
