#!/bin/bash -e
# usage:
#   ./create-cognito-user.sh $ENV $email $password $role $section "$name"
#   where $ENV is dev|stg|prod|test|...
#   see shared/src/business/entities/User.js for valid roles and sections 
#   $USTC_ADMIN_PASS must be set as an environment variable.

ENV=$1
REGION="us-east-1"

CURRENT_COLOR=$(aws dynamodb get-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --key '{"pk":{"S":"deployed-stack"},"sk":{"S":"deployed-stack"}}' | jq -r ".Item.current.S")

restApiId=$(aws apigateway get-rest-apis --region="${REGION}" --query "items[?name=='${ENV}-ef-cms-users-${CURRENT_COLOR}'].id" --output text)

USER_POOL_ID=$(aws cognito-idp list-user-pools --query "UserPools[?Name == 'efcms-${ENV}'].Id | [0]" --max-results 30 --region "${REGION}")
USER_POOL_ID="${USER_POOL_ID%\"}"
USER_POOL_ID="${USER_POOL_ID#\"}"

CLIENT_ID=$(aws cognito-idp list-user-pool-clients --user-pool-id "${USER_POOL_ID}" --query "UserPoolClients[?ClientName == 'client'].ClientId | [0]" --max-results 30 --region "${REGION}")
CLIENT_ID="${CLIENT_ID%\"}"
CLIENT_ID="${CLIENT_ID#\"}"

generate_post_data() {
  email=$1
  password=$2
  role=$3
  section=$4
  name=$5
  cat <<EOF
{
  "email": "$email",
  "password": "$password",
  "role": "$role",
  "section": "$section",
  "name": "$name",
  "contact": {
    "address1": "234 Main St",
    "address2": "Apartment 4",
    "address3": "Under the stairs",
    "city": "Chicago",
    "countryType": "domestic",
    "phone": "+1 (555) 555-5555",
    "postalCode": "61234",
    "state": "IL"
  },
  "barNumber": "PT1234"
}
EOF
}

createAccount() {
  email=$1
  password=$2
  role=$3
  section=$4
  name=$5

  response=$(aws cognito-idp admin-initiate-auth \
    --user-pool-id "${USER_POOL_ID}" \
    --client-id "${CLIENT_ID}" \
    --region "${REGION}" \
    --auth-flow ADMIN_NO_SRP_AUTH \
    --output json \
    --auth-parameters USERNAME="ustcadmin@example.com"',PASSWORD'="${USTC_ADMIN_PASS}")

  adminToken=$(echo "${response}" | jq -r ".AuthenticationResult.IdToken")
  curl --header "Content-Type: application/json" \
    --header "Authorization: Bearer ${adminToken}" \
    --request POST \
    --output json \
    --data "$(generate_post_data "${email}" "${password}" "${role}" "${section}" "${name}")" \
      "https://${restApiId}.execute-api.us-east-1.amazonaws.com/${ENV}"

  response=$(aws cognito-idp admin-initiate-auth \
    --user-pool-id "${USER_POOL_ID}" \
    --client-id "${CLIENT_ID}" \
    --region "${REGION}" \
    --auth-flow ADMIN_NO_SRP_AUTH \
    --output json \
    --auth-parameters USERNAME="${email}",PASSWORD="${password}")  
  session=$(echo "${response}" | jq -r ".Session")

  if [ "$session" != "null" ]; then
    aws cognito-idp admin-respond-to-auth-challenge \
      --user-pool-id  "${USER_POOL_ID}" \
      --client-id "${CLIENT_ID}" \
      --region "${REGION}" \
      --output json \
      --challenge-name NEW_PASSWORD_REQUIRED \
      --challenge-responses NEW_PASSWORD="${password}",USERNAME="${email}" \
      --session "${session}"
  fi
}

if [[ "$#" -ne 6 ]]; then
  echo "Error: Insufficient number of parameters"
  echo "$#"
  exit 1
fi

if [[ -z "$USTC_ADMIN_PASS" ]]; then
  echo "Error: USTC_ADMIN_PASS not set as an environment variable"
  exit 1
fi

email=$2
password=$3
role=$4
section=$5
name=$6

if [[ ${#password} -lt 8 ]]; then
  echo "Error: Password is too short"
elif [[ "$password"  =~ ^[:upper:] ]]; then
  echo "Error: Password needs an uppercase character"
elif [[ "$password"  =~ ^[:lower:] ]]; then
  echo "Error: Password needs a lowercase character"
elif [[ "$password"  =~ ^[:digit:] ]]; then
  echo "Error: Password needs a number"
elif [[ "$password"  =~ [:punct:] ]]; then
  echo "Error: Password needs a special character"
fi

createAccount "${email}" "${password}" "${role}" "${section}" "${name}"
