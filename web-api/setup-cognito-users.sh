#!/bin/bash -e
ENV=$1
REGION="us-east-1"
restApiId=$(aws apigateway get-rest-apis --region="${REGION}" --query "items[?name=='${ENV}-ef-cms-users'].id" --output text)

USER_POOL_ID=$(aws cognito-idp list-user-pools --query "UserPools[?Name == 'efcms-${ENV}'].Id | [0]" --max-results 30 --region "${REGION}")
USER_POOL_ID="${USER_POOL_ID%\"}"
USER_POOL_ID="${USER_POOL_ID#\"}"

CLIENT_ID=$(aws cognito-idp list-user-pool-clients --user-pool-id "${USER_POOL_ID}" --query "UserPoolClients[?ClientName == 'client'].ClientId | [0]" --max-results 30 --region "${REGION}")
CLIENT_ID="${CLIENT_ID%\"}"
CLIENT_ID="${CLIENT_ID#\"}"

generate_post_data() {
  email=$1
  role=$2
  name="Test ${role}$i"
  barNumber=$4
  cat <<EOF
{
  "email": "$email",
  "password": "Testing1234$",
  "role": "$role",
  "name": "$name",
  "addressLine1": "123 Main Street",
  "addressLine2": "Los Angeles, CA 98089",
  "barNumber": "$barNumber",
  "phone": "111-111-1111"
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

createAccount() {
  email=$1
  role=$2
  i=$3
  barNumber=$4

  curl --header "Content-Type: application/json" \
    --header "Authorization: Bearer ${adminToken}" \
    --request POST \
    --data "$(generate_post_data "${email}" "${role}" "${i}" "${barNumber}")" \
      "https://${restApiId}.execute-api.us-east-1.amazonaws.com/${ENV}"

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
      --session "${session}"
  fi
}

createManyAccounts() {
  emailPrefix=$1
  role=$1
  for i in $(seq 1 5);
  do
    createAccount "${emailPrefix}${i}@example.com" "${role}" "${i}" "0"
  done
}

createAdmin "ustcadmin@example.com" "admin" "admin"

createManyAccounts "petitioner"
createManyAccounts "petitionsclerk"
createManyAccounts "docketclerk"
createManyAccounts "seniorattorney"
createAccount "practitioner1@example.com" "practitioner" "1" "PT1234"
createAccount "practitioner2@example.com" "practitioner" "2" "PT5432"
createAccount "practitioner3@example.com" "practitioner" "3" "PT1111"
createAccount "practitioner4@example.com" "practitioner" "4" "PT2222"
createAccount "practitioner5@example.com" "practitioner" "5" "PT3333"
createAccount "practitioner6@example.com" "practitioner" "" "PT4444"
createAccount "practitioner7@example.com" "practitioner" "" "PT5555"
createAccount "practitioner8@example.com" "practitioner" "" "PT6666"
createAccount "practitioner9@example.com" "practitioner" "" "PT7777"
createAccount "practitioner10@example.com" "practitioner" "" "PT8888"
createAccount "respondent1@example.com" "respondent" "1" "RT6789"
createAccount "respondent2@example.com" "respondent" "2" "RT0987"
createAccount "respondent3@example.com" "respondent" "3" "RT7777"
createAccount "respondent4@example.com" "respondent" "4" "RT8888"
createAccount "respondent5@example.com" "respondent" "5" "RT9999"
createAccount "respondent6@example.com" "respondent" "" "RT6666"
createAccount "respondent7@example.com" "respondent" "" "RT0000"
createAccount "respondent8@example.com" "respondent" "" "RT1111"
createAccount "respondent9@example.com" "respondent" "" "RT2222"
createAccount "respondent10@example.com" "respondent" "" "RT3333"
