#!/bin/bash

# Usage
#   verify the USTC admin user is disabled in Cognito 

# Arguments
#   - $1 - the environment [dev, stg, prod, exp1, exp1, etc]
#   - $USTC_ADMIN_USER - the USTC admin user email env variable

( ! command -v jq > /dev/null ) && echo "jq must be installed on your machine." && exit 1
[ -z "${1}" ] && echo "ERROR: The env to verify the USTC admin user is missing from the \$1 argument.  An example value of this includes [dev, stg, prod... ]" && exit 1
[ -z "${USTC_ADMIN_USER}" ] && echo "ERROR: The USTC admin user is missing from environment variables." && exit 1

ENV="${1}"

# get the user pool
cognito_user_pool_name="efcms-${ENV}"

# get the admin_user's activation status
admin_user_is_disabled=$(aws cognito-idp list-user-pools --max-results=60 --region=us-east-1 | jq '.UserPools[] | select(.Name=="'"${cognito_user_pool_name}"'") | .LambdaConfig | .PostConfirmation and .PostAuthentication')

if [ "${admin_user_is_disabled}" != 'true' ]; then
  echo "ERROR: USTC_ADMIN_USER is enabled in Cognito.  Please disable the admin user."
  exit 1
fi

echo "USTC_ADMIN_USER is disabled in Cognito."
