#!/bin/bash -e
ENV=$1
REGION="us-east-1"

USER_POOL_ID=$(aws cognito-idp list-user-pools --query "UserPools[?Name == 'efcms-${ENV}'].Id | [0]" --max-results 30 --region "${REGION}")
USER_POOL_ID="${USER_POOL_ID%\"}"
USER_POOL_ID="${USER_POOL_ID#\"}"

CLIENT_ID=$(aws cognito-idp list-user-pool-clients --user-pool-id "${USER_POOL_ID}" --query "UserPoolClients[?ClientName == 'client'].ClientId | [0]" --max-results 30 --region "${REGION}")
CLIENT_ID="${CLIENT_ID%\"}"
CLIENT_ID="${CLIENT_ID#\"}"

createAccount() {
  email=$1
  role=$2
  aws cognito-idp sign-up \
    --region "${REGION}" \
    --client-id "${CLIENT_ID}" \
    --username "${email}" \
    --user-attributes 'Name="name",'Value="Test ${role^}" 'Name="custom:role",'Value="${role}" \
    --password Testing1234$ || true

  aws cognito-idp admin-confirm-sign-up \
    --region "${REGION}" \
    --user-pool-id "${USER_POOL_ID}" \
    --username "${email}" || true

  # for updating attributes in the future
  # aws cognito-idp admin-update-user-attributes \
  #   --region "${REGION}" \
  #   --user-pool-id "${USER_POOL_ID}" \
  #   --username "${email}" \
  #   --user-attributes 'Name="custom:role",'Value="${role}" || true
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
