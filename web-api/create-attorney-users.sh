#!/bin/bash -e
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
  role=$2
  section=$3
  name=$4
  barNumber=$5
  cat <<EOF
{
  "email": "$email",
  "password": "Testing1234$",
  "role": "$role",
  "section": "$section",
  "name": "$name",
  "barNumber": "$barNumber"
}
EOF
}

createAccount() {
  email=$1
  role=$2
  section=$3
  name=$4
  barNumber=$5

  echo $(generate_post_data "${email}" "${role}" "${section}" "${name}" "${barNumber}")

  echo $restApiId

  curl --header "Content-Type: application/json" \
    --header "Authorization: Bearer ${adminToken}" \
    --request POST \
    --data "$(generate_post_data "${email}" "${role}" "${section}" "${name}" "${barNumber}")" \
      "https://${restApiId}.execute-api.us-east-1.amazonaws.com/${ENV}/attorney"
}

response=$(aws cognito-idp admin-initiate-auth \
  --user-pool-id "${USER_POOL_ID}" \
  --client-id "${CLIENT_ID}" \
  --region "${REGION}" \
  --auth-flow ADMIN_NO_SRP_AUTH \
  --auth-parameters USERNAME="petitionsclerk1@example.com"',PASSWORD'="Testing1234$")
adminToken=$(echo "${response}" | jq -r ".AuthenticationResult.IdToken")
echo $adminToken

while read -r line
do
  IFS=';' read -ra ADDR <<< "$line"
  section="${ADDR[0]}"
  role="${ADDR[0]}"
  name="${ADDR[1]}"
  barNumber="${ADDR[2]}"
  fakeEmail="${ADDR[3]/$'\r'}"
  createAccount "${fakeEmail}" "${role}" "${section}" "${name}" "${barNumber}"
done < attorney_users.csv

