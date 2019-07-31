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
  barnumber=$4
  cat <<EOF
{
  "email": "$email",
  "password": "Testing1234$",
  "role": "$role",
  "name": "$name",
  "addressLine1": "123 Main Street",
  "addressLine2": "Los Angeles, CA 98089",
  "barnumber": "$barnumber",
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
  barnumber=$4

  curl --header "Content-Type: application/json" \
    --header "Authorization: Bearer ${adminToken}" \
    --request POST \
    --data "$(generate_post_data "${email}" "${role}" "${i}" "${barnumber}")" \
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
    createAccount "${emailPrefix}${i}@example.com" "${role}" "${i}"
  done
}

createAdmin "ustcadmin@example.com" "admin" "admin"

createManyAccounts "petitioner"
createManyAccounts "petitionsclerk"
createManyAccounts "docketclerk"
createManyAccounts "seniorattorney"
createAccount "practitioner1@example.com" "practitioner" "1" "12345"
createAccount "practitioner2@example.com" "practitioner" "2" "54321"
createAccount "practitioner3@example.com" "practitioner" "3" "11111"
createAccount "practitioner4@example.com" "practitioner" "4" "22222"
createAccount "practitioner5@example.com" "practitioner" "5" "33333"
createAccount "respondent1@example.com" "respondent" "1" "67890"
createAccount "respondent2@example.com" "respondent" "2" "09876"
createAccount "respondent3@example.com" "respondent" "3" "77777"
createAccount "respondent4@example.com" "respondent" "4" "88888"
createAccount "respondent5@example.com" "respondent" "5" "99999"
