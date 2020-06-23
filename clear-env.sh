#!/bin/bash -e

# Usage
#   ./clear-env.sh $ENV

# Requirements
#   - terraform must be installed on your machine
#   - aws cli must be installed on your machine
#   - aws credentials must be setup on your machine
#   - node must be setup on your machine

# Arguments
#   - $1 - the environment to clear

[ -z "$1" ] && echo "The branch name to check must be provided as the \$1 argument." && exit 1

ENV=$1

if [[ -z "${USTC_ADMIN_PASS}" ]]; then
  echo "You must have USTC_ADMIN_PASS set in your environment"
  exit 1
fi

$(which terraform) > /dev/null
if [[ "$?" == "1" ]]; then
  echo "Terraform was not found on your path. Please install terraform."
  exit 1
fi

./web-api/clear-elasticsearch-index.sh $ENV
./web-api/setup-elasticsearch-index.sh $ENV

pushd web-api
node clear-dynamodb-table.js $ENV
./setup-cognito-users.sh $ENV
./setup-court-users.sh $ENV
popd
