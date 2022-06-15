#!/bin/bash

# Usage
#   verify the USTC admin user is disabled in Cognito 

# Arguments
#   - $1 - the environment [dev, stg, prod, exp1, exp1, etc]

( ! command -v jq > /dev/null ) && echo "jq must be installed on your machine." && exit 1
[ -z "${1}" ] && echo "ERROR: The env to verify the USTC admin user is missing from the \$1 argument.  An example value of this includes [dev, stg, prod... ]" && exit 1

ENV="${1}"
# USTC_ADMIN_USER=

cognito_user_pool_name="efcms-${ENV}"

# const deactivateAdminAccount = async () => {
#   const cognito = new CognitoIdentityServiceProvider({ region: 'us-east-1' });
#   const UserPoolId = await getUserPoolId();

#   await cognito
#     .adminDisableUser({
#       UserPoolId,
#       Username: USTC_ADMIN_USER,
#     })
#     .promise();
# };

# get the user pool
# get the admin_user's activation status

admin_user_is_disabled=$(aws cognito-idp list-user-pools --max-results=60 --region=us-east-1 | jq '.UserPools[] | select(.Name=="'"${cognito_user_pool_name}"'") | .LambdaConfig | .PostConfirmation and .PostAuthentication')

if [ "${admin_user_is_disabled}" != 'true' ]; then
  echo "ERROR: Cognito user pool ${cognito_user_pool_name} is enabled.  Please disable the admin user."
  exit 1
fi

echo "Cognito user pool ${cognito_user_pool_name} has all its Lambda triggers"
