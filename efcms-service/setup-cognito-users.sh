#!/bin/bash -e
ENV=$1
REGION="us-east-1"
restApiId=$(aws apigateway get-rest-apis --region="${REGION}" --query "items[?name=='${ENV}-ef-cms'].id" --output text)

USER_POOL_ID=$(aws cognito-idp list-user-pools --query "UserPools[?Name == 'efcms-${ENV}'].Id | [0]" --max-results 30 --region "${REGION}")
USER_POOL_ID="${USER_POOL_ID%\"}"
USER_POOL_ID="${USER_POOL_ID#\"}"

CLIENT_ID=$(aws cognito-idp list-user-pool-clients --user-pool-id "${USER_POOL_ID}" --query "UserPoolClients[?ClientName == 'client'].ClientId | [0]" --max-results 30 --region "${REGION}")
CLIENT_ID="${CLIENT_ID%\"}"
CLIENT_ID="${CLIENT_ID#\"}"

generate_post_data() {
  email=$1
  role=$2
  name=$role
  cat <<EOF
{
  "email": "$email",
  "password": "Testing1234$",
  "role": "$role",
  "name": "$name"
}
EOF
}

createAccount() {
  email=$1
  role=$2
  # TODO: this is some generic old expired token... but needed for now
  token="eyJraWQiOiJ2U2pTa3FZVkJjVkJOWk5qZ1gzWFNzcERZSjU4QmQ3OGYrSzlDSXhtck44PSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiSmk3ekxYSnRkTklJbEEyU1dRTkhfdyIsInN1YiI6IjVmOGUwMGViLTgyMGEtNDNjMi05M2IzLTQyY2FlZjgxZjAxYiIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfN3VSa0YwQXhuIiwiY29nbml0bzp1c2VybmFtZSI6IjVmOGUwMGViLTgyMGEtNDNjMi05M2IzLTQyY2FlZjgxZjAxYiIsImF1ZCI6IjZ0dTZqMXN0djV1Z2N1dDdkcXNxZHVybjhxIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1NTAwOTkyOTgsIm5hbWUiOiJUZXN0IERvY2tldGNsZXJrIiwiZXhwIjoxNTUwMTAyODk4LCJjdXN0b206cm9sZSI6ImRvY2tldGNsZXJrIiwiaWF0IjoxNTUwMDk5Mjk4LCJlbWFpbCI6ImRvY2tldGNsZXJrMUBleGFtcGxlLmNvbSJ9.lGDd5xVHj-NJFSdifJyx4gOdt4J2BOxtrmYxebRouQf_XI0j2gqbKne4Jr3nzlpL9pWibj8PBX8zLYj4PKSdPvVFI_zTXoApR4duUOQtInwCbffwojPnzNPS4dGJhnfNnH9Wn_EdMMRcWbbdXoKyUMQmdYXD5sUJh2wX3Eur9r9bJ2MdLuw6Iuy6aQ86mD1_qkk24Oq-LVLA9MboD97vY42aXlbUFInmld_TgjvNuXcw4QFztUPUrtz7O-tRdOtfzBRaDYUg6SOZl4fN-RoI3l1SULhBYWE1yBXE173uOOGse_rqpjfnXs_tcCmoicQEcjzpD9WLWXLyEX0FObj9gQ"

  curl --header "Content-Type: application/json" \
    --header "Authorization: Bearer ${token}" \
    --request POST \
    --data "$(generate_post_data $email $role)" \
    # "http://localhost:3000/v1/users"
   "https://${restApiId}.execute-api.us-east-1.amazonaws.com/${ENV}/v1/users"

  response=$(aws cognito-idp admin-initiate-auth \
    --user-pool-id "${USER_POOL_ID}" \
    --client-id "${CLIENT_ID}" \
    --auth-flow ADMIN_NO_SRP_AUTH \
    --auth-parameters USERNAME="${email}",PASSWORD="Testing1234$") 

  session=$(echo "${response}" | jq -r ".Session")

  aws cognito-idp admin-respond-to-auth-challenge \
    --user-pool-id  "${USER_POOL_ID}" \
    --client-id "${CLIENT_ID}" \
    --challenge-name NEW_PASSWORD_REQUIRED \
    --challenge-responses NEW_PASSWORD="Testing1234$",USERNAME="${email}" \
    --session "${session}"
} 

createManyAccounts() {
  emailPrefix=$1
  role=$1
  for i in $(seq 1 5);
  do
    createAccount "${emailPrefix}${i}@example.com" "${role}"
  done
}

createManyAccounts "petitioner"
createManyAccounts "petitionsclerk"
createManyAccounts "docketclerk"
createManyAccounts "seniorattorney"
createManyAccounts "intakeclerk"
createManyAccounts "respondent"