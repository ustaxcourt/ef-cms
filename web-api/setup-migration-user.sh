#!/bin/bash -e

# Usage
#   creates the TESTING users inside our system

# Requirements
#   - curl must be installed on your machine
#   - jq must be installed on your machine
#   - aws cli must be installed on your machine
#   - aws credentials must be setup on your machine

# Arguments
#   - $1 - the environment [dev, stg, prod, exp1, exp1, etc]

[ -z "$1" ] && echo "The ENV to deploy to must be provided as the \$1 argument.  An example value of this includes [dev, stg, prod... ]" && exit 1
[ -z "${USTC_ADMIN_PASS}" ] && echo "You must have USTC_ADMIN_PASS set in your environment" && exit 1
[ -z "${AWS_ACCESS_KEY_ID}" ] && echo "You must have AWS_ACCESS_KEY_ID set in your environment" && exit 1
[ -z "${AWS_SECRET_ACCESS_KEY}" ] && echo "You must have AWS_SECRET_ACCESS_KEY set in your environment" && exit 1

ENV=$1
REGION="us-east-1"

CURRENT_COLOR=$(aws dynamodb get-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --key '{"pk":{"S":"deployed-stack"},"sk":{"S":"deployed-stack"}}' | jq -r ".Item.current.S")

restApiId=$(aws apigateway get-rest-apis --region="${REGION}" --query "items[?name=='gateway_api_${ENV}'].id" --output text)

USER_POOL_ID=$(aws cognito-idp list-user-pools --query "UserPools[?Name == 'efcms-${ENV}'].Id | [0]" --max-results 30 --region "${REGION}")
USER_POOL_ID="${USER_POOL_ID%\"}"
USER_POOL_ID="${USER_POOL_ID#\"}"

CLIENT_ID=$(aws cognito-idp list-user-pool-clients --user-pool-id "${USER_POOL_ID}" --query "UserPoolClients[?ClientName == 'client'].ClientId | [0]" --max-results 30 --region "${REGION}")
CLIENT_ID="${CLIENT_ID%\"}"
CLIENT_ID="${CLIENT_ID#\"}"

generate_post_data() {
  email=$1
  role=$2
  barNumber=$3
  section=$4
  name=$5
  employer=$6
  firstName=$7
  middleName=$8
  lastName=$9
  suffix=${10}
  cat <<EOF
{
  "email": "$email",
  "password": "Testing1234$",
  "role": "$role",
  "section": "$section",
  "name": "$name",
  "firstName": "$firstName",
  "middleName": "$middleName",
  "lastName": "$lastName",
  "suffix": "$suffix",
  "barNumber": "$barNumber",
  "admissionsDate": "2019-03-01T21:40:46.415Z",
  "admissionsStatus": "Active",
  "birthYear": "1950",
  "employer": "$employer",
  "firmName": "Some Firm",
  "originalBarState": "WA",
  "practitionerType": "Attorney",
  "contact": {
    "address1": "234 Main St",
    "address2": "Apartment 4",
    "address3": "Under the stairs",
    "city": "Chicago",
    "countryType": "domestic",
    "phone": "+1 (555) 555-5555",
    "postalCode": "61234",
    "state": "IL"
  }
}
EOF
}

createAdmin() {
  email=$1
  role=$2
  name=$3

  aws cognito-idp sign-up \
    --region "${REGION}" \
    --client-id "${CLIENT_ID}" \
    --username "${email}" \
    --user-attributes 'Name="name",'Value="${name}" 'Name="custom:role",'Value="${role}" \
    --password "${USTC_ADMIN_PASS}" || true

  aws cognito-idp admin-confirm-sign-up \
    --region "${REGION}" \
    --user-pool-id "${USER_POOL_ID}" \
    --username "${email}" || true

  response=$(aws cognito-idp admin-initiate-auth \
    --user-pool-id "${USER_POOL_ID}" \
    --client-id "${CLIENT_ID}" \
    --region "${REGION}" \
    --auth-flow ADMIN_NO_SRP_AUTH \
    --auth-parameters USERNAME="${email}"',PASSWORD'="${USTC_ADMIN_PASS}")
  adminToken=$(echo "${response}" | jq -r ".AuthenticationResult.IdToken")
}

#createAccount [email] [role] [index] [barNumber] [section] [overrideName(optional)] [employer(optional)] [firstName(*optional)] [middleName(optional)] [lastName(*optional)] [suffix(optional)]
# *optional - only optional when user is NOT irsPractitioner or privatePractitioner
createAccount() {
  email=$1
  role=$2
  i=$3
  barNumber=$4
  section=$5
  name=${6:-Test ${role}$3}
  employer=$7
  firstName=$8
  middleName=$9
  lastName=${10}
  suffix=${11}

  curl --header "Content-Type: application/json" \
    --header "Authorization: Bearer ${adminToken}" \
    --request POST \
    --data "$(generate_post_data "${email}" "${role}" "${barNumber}" "${section}" "${name}" "${employer}" "${firstName}" "${middleName}" "${lastName}" "${suffix}")" \
      "https://${restApiId}.execute-api.us-east-1.amazonaws.com/${ENV}/users"

  response=$(aws cognito-idp admin-initiate-auth \
    --user-pool-id "${USER_POOL_ID}" \
    --client-id "${CLIENT_ID}" \
    --region "${REGION}" \
    --auth-flow ADMIN_NO_SRP_AUTH \
    --auth-parameters USERNAME="${email}"',PASSWORD="Testing1234$"')

  session=$(echo "${response}" | jq -r ".Session")

  if [ "$session" != "null" ]; then
    aws cognito-idp admin-respond-to-auth-challenge \
      --user-pool-id  "${USER_POOL_ID}" \
      --client-id "${CLIENT_ID}" \
      --region "${REGION}" \
      --challenge-name NEW_PASSWORD_REQUIRED \
      --challenge-responses 'NEW_PASSWORD="Testing1234$",'USERNAME="${email}" \
      --session="${session}"
  fi
}

createAdmin "ustcadmin@example.com" "admin" "admin"
createAccount "migrator@example.com" "admin" "" "" "admin"

wait
