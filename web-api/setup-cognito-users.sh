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
  barNumber=$3
  section=$4
  name=$5
  cat <<EOF
{
  "email": "$email",
  "password": "Testing1234$",
  "role": "$role",
  "section": "$section",
  "name": "$name",
  "address1": "123 Main Street",
  "address2": "Los Angeles, CA 98089",
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

#createAccount [email] [role] [index] [barNumber] [section] [overrideName(optional)]
createAccount() {
  email=$1
  role=$2
  i=$3
  barNumber=$4
  section=$5
  name=${6:-Test ${role}$3}

  curl --header "Content-Type: application/json" \
    --header "Authorization: Bearer ${adminToken}" \
    --request POST \
    --data "$(generate_post_data "${email}" "${role}" "${barNumber}" "${section}" "${name}")" \
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
  section=$2
  for i in $(seq 1 5);
  do
    createAccount "${emailPrefix}${i}@example.com" "${role}" "${i}" "" "${section}"
  done
}

createPractitionerAccount() {
  index=$1
  barNumber=$2
  overrideName=$3
  name=${overrideName:-Test practitioner${index}}
  
  createAccount "practitioner${index}@example.com" "practitioner" "${index}" "${barNumber}" "practitioner" "${name}"
}

createRespondentAccount() {
  index=$1
  barNumber=$2
  overrideName=$3
  name=${overrideName:-Test respondent${index}}
  
  createAccount "respondent${index}@example.com" "respondent" "${index}" "${barNumber}" "respondent" "${name}"
}

createJudgeAccount() {
  judgeName=$1
  judgeNameLower=$(echo "${judgeName}" | tr '[:upper:]' '[:lower:]')

  createAccount "judge${judgeName}@example.com" "judge" "" "" "${judgeNameLower}sChambers" "Judge ${judgeName}"
}

createAdmin "ustcadmin@example.com" "admin" "admin"

createManyAccounts "petitioner" "petitioner"
createManyAccounts "petitionsclerk" "petitions"
createManyAccounts "docketclerk" "docket"
createManyAccounts "seniorattorney" "seniorattorney"
createPractitionerAccount "1" "PT1234"
createPractitionerAccount "2" "PT5432"
createPractitionerAccount "3" "PT1111"
createPractitionerAccount "4" "PT2222"
createPractitionerAccount "5" "PT3333"
createPractitionerAccount "6" "PT4444" "Test practitioner"
createPractitionerAccount "7" "PT5555" "Test practitioner"
createPractitionerAccount "8" "PT6666" "Test practitioner"
createPractitionerAccount "9" "PT7777" "Test practitioner"
createPractitionerAccount "10" "PT8888" "Test practitioner"
createRespondentAccount "1" "RT6789"
createRespondentAccount "2" "RT0987"
createRespondentAccount "3" "RT7777"
createRespondentAccount "4" "RT8888"
createRespondentAccount "5" "RT9999"
createRespondentAccount "6" "RT6666" "Test respondent"
createRespondentAccount "7" "RT0000" "Test respondent"
createRespondentAccount "8" "RT1111" "Test respondent"
createRespondentAccount "9" "RT2222" "Test respondent"
createRespondentAccount "10" "RT3333" "Test respondent"
createJudgeAccount "Armen"
createJudgeAccount "Ashford"
createJudgeAccount "Buch"
createJudgeAccount "Carluzzo"
createJudgeAccount "Cohen"
