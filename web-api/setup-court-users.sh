#!/bin/bash -e

# Usage
#   creates the COURT users inside our system.  
#   The court users come directly from a court_users.csv

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
  section=$3
  name=$4
  judgeFullName=$5
  judgeTitle=$6
  cat <<EOF
{
  "email": "$email",
  "password": "Testing1234$",
  "role": "$role",
  "section": "$section",
  "name": "$name",
  "judgeFullName": "$judgeFullName",
  "judgeTitle": "$judgeTitle"
}
EOF
}

createAccount() {
  email=$1
  role=$2
  section=$3
  name=$4
  judgeFullName=$5
  judgeTitle=$6

  node ../shared/src/tools/validateUser.js "${email}" "${role}" "${section}" "${name}" "${judgeFullName}" "${judgeTitle}"

  curl --header "Content-Type: application/json" \
    --header "Authorization: Bearer ${adminToken}" \
    --request POST \
    --data "$(generate_post_data "${email}" "${role}" "${section}" "${name}" "${judgeFullName}" "${judgeTitle}")" \
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

response=$(aws cognito-idp admin-initiate-auth \
  --user-pool-id "${USER_POOL_ID}" \
  --client-id "${CLIENT_ID}" \
  --region "${REGION}" \
  --auth-flow ADMIN_NO_SRP_AUTH \
  --auth-parameters USERNAME="ustcadmin@example.com"',PASSWORD'="${USTC_ADMIN_PASS}")
adminToken=$(echo "${response}" | jq -r ".AuthenticationResult.IdToken")

(( i=1 ))

while read -r line
do
  IFS=';' read -ra ADDR <<< "$line"
  section="${ADDR[0]}"
  role="${ADDR[1]}"
  # firstname="${ADDR[2]}"
  # lastname="${ADDR[3]}"
  name="${ADDR[4]}"
  # placeOfTrial="${ADDR[5]}"
  # realEmail="${ADDR[6]}"
  fakeEmail="${ADDR[7]/$'\r'}"
  judgeFullName="${ADDR[8]/$'\r'}"
  judgeTitle="${ADDR[9]/$'\r'}"
  createAccount "${fakeEmail}" "${role}" "${section}" "${name}" "${judgeFullName}" "${judgeTitle}" &

  if [[ "$i" == "15" ]]; then
    wait
    let i=1
  else
    i=$((i+1))
  fi

done < court_users.csv

wait