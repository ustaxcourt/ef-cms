#!/bin/bash -e

# Usage
#   creates the IRS user in the IRS user pool

# Arguments
#   - $1 - the environment [dev, stg, prod, exp1, etc]

( ! command -v jq > /dev/null ) && echo "jq must be installed on your machine." && exit 1
( ! command -v curl > /dev/null ) && echo "curl was not found on your path. Please install curl." && exit 1
( ! command -v aws > /dev/null ) && echo "aws was not found on your path. Please install aws." && exit 1

[ -z "$1" ] && echo "The ENV to deploy to must be provided as the \$1 argument.  An example value of this includes [dev, stg, prod... ]" && exit 1
[ -z "${USTC_ADMIN_PASS}" ] && echo "You must have USTC_ADMIN_PASS set in your environment" && exit 1
[ -z "${USTC_ADMIN_USER}" ] && echo "You must have USTC_ADMIN_USER set in your environment" && exit 1
[ -z "${AWS_ACCESS_KEY_ID}" ] && echo "You must have AWS_ACCESS_KEY_ID set in your environment" && exit 1
[ -z "${AWS_SECRET_ACCESS_KEY}" ] && echo "You must have AWS_SECRET_ACCESS_KEY set in your environment" && exit 1
[ -z "${DEPLOYING_COLOR}" ] && echo "You must have DEPLOYING_COLOR set in your environment" && exit 1
[ -z "${DEFAULT_ACCOUNT_PASS}" ] && echo "You must have DEFAULT_ACCOUNT_PASS set in your environment" && exit 1

ENV=$1
REGION="us-east-1"

restApiId=$(aws apigateway get-rest-apis --region="${REGION}" --query "items[?name=='gateway_api_${ENV}_${DEPLOYING_COLOR}'].id" --output text)

USER_POOL_ID=$(aws cognito-idp list-user-pools --query "UserPools[?Name == 'efcms-${ENV}'].Id | [0]" --max-results 30 --region "${REGION}" --output text)

CLIENT_ID=$(aws cognito-idp list-user-pool-clients --user-pool-id "${USER_POOL_ID}" --query "UserPoolClients[?ClientName == 'client'].ClientId | [0]" --max-results 30 --region "${REGION}" --output text)

generate_post_data() {
  email=$1
  role=$2
  section=$3
  name=$4
  cat <<EOF
{
  "email": "$email",
  "password": "${DEFAULT_ACCOUNT_PASS}",
  "role": "$role",
  "section": "$section",
  "name": "$name"
}
EOF
}

aws cognito-idp admin-enable-user --user-pool-id "${USER_POOL_ID}" --username "${USTC_ADMIN_USER}"

response=$(aws cognito-idp admin-initiate-auth \
  --user-pool-id "${USER_POOL_ID}" \
  --client-id "${CLIENT_ID}" \
  --region "${REGION}" \
  --auth-flow ADMIN_NO_SRP_AUTH \
  --auth-parameters USERNAME="${USTC_ADMIN_USER}"',PASSWORD'="${USTC_ADMIN_PASS}")
adminToken=$(echo "${response}" | jq -r ".AuthenticationResult.IdToken")

curl --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${adminToken}" \
  --request POST \
  --data "$(generate_post_data "${IRS_SUPERUSER_EMAIL}" "irsSuperuser" "irsSuperuser" "IRS Superuser")" \
    "https://${restApiId}.execute-api.us-east-1.amazonaws.com/${ENV}/users"

aws cognito-idp admin-disable-user --user-pool-id "${USER_POOL_ID}" --username "${USTC_ADMIN_USER}"

