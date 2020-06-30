#!/bin/bash -e

# Usage
#   ./create-cognito-user.sh $ENV $email $password $role $section "$name"
#   where $ENV is dev|stg|prod|test|...
#   see shared/src/business/entities/User.js for valid roles and sections 

# Requirements
#   - curl must be installed on your machine
#   - jq must be installed on your machine
#   - aws cli must be installed on your machine
#   - aws credentials must be setup on your machine
#   - USTC_ADMIN_PASS must be set as an environment variable.

# Arguments
#   - $1 - the environment [dev, stg, prod, exp1, exp1, etc]
#   - $2 - the email address of the user
#   - $3 - the password for the new user
#   - $4 - the role of the user [petitionsclerk, docketclerk, ....]
#   - $5 - the section of the user [petitionsclerk, docketclerk, ...]
#   - $6 - the full name of the user

[ -z "$1" ] && echo "The ENV must be provided as the \$1 argument.  An example value of this includes [dev, stg, prod... ]." && exit 1
[ -z "$2" ] && echo "The email address of the user must be provided as \$2 argument." && exit 1
[ -z "$3" ] && echo "The password of the user must be provided as the \$3 argument." && exit 1
[ -z "$4" ] && echo "The role of the user must be provided as the \$4 argument." && exit 1
[ -z "$5" ] && echo "The section of the usermust be provided as the \$5 argument." && exit 1
[ -z "$6" ] && echo "The name of the user to must be provided as the \$6 argument." && exit 1
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
      "https://${restApiId}.execute-api.us-east-1.amazonaws.com/${ENV}/users"

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
