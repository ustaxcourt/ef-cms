#!/bin/bash

# Usage
#   smoketest to verify the Cognito pool retains its Lambda triggers

# Arguments
#   - $1 - the environment [dev, stg, prod, exp1, etc]

( ! command -v jq > /dev/null ) && echo "jq must be installed on your machine." && exit 1
[ -z "${1}" ] && echo "ERROR: The env to run smoketest is missing from the \$1 argument.  An example value of this includes [dev, stg, prod... ]" && exit 1

ENV="${1}"

cognito_user_pool_name="efcms-${ENV}"

user_pool_has_both_lambda_triggers=$(aws cognito-idp list-user-pools --max-results=60 --region=us-east-1 | jq '.UserPools[] | select(.Name=="'"${cognito_user_pool_name}"'") | .LambdaConfig | .PostConfirmation and .PostAuthentication')

if [ "${user_pool_has_both_lambda_triggers}" != 'true' ]; then
  echo "ERROR: Cognito user pool ${cognito_user_pool_name} is missing either the PostConfirmation or PostAuthentication Lambda trigger"
  exit 1
fi

echo "Cognito user pool ${cognito_user_pool_name} has all its Lambda triggers"
