#!/bin/bash -e
ENV=$1
REGION="us-east-1"

USER_POOL_ID=$(aws cognito-idp list-user-pools --query "UserPools[?Name == 'efcms-${ENV}'].Id | [0]" --max-results 30 --region "${REGION}")
USER_POOL_ID="${USER_POOL_ID%\"}"
USER_POOL_ID="${USER_POOL_ID#\"}"

CLIENT_ID=$(aws cognito-idp list-user-pool-clients --user-pool-id "${USER_POOL_ID}" --query "UserPoolClients[?ClientName == 'client'].ClientId | [0]" --max-results 30 --region "${REGION}")
CLIENT_ID="${CLIENT_ID%\"}"
CLIENT_ID="${CLIENT_ID#\"}"

response=$(aws cognito-idp admin-initiate-auth \
  --user-pool-id "${USER_POOL_ID}" \
  --client-id "${CLIENT_ID}" \
  --region "${REGION}" \
  --auth-flow ADMIN_NO_SRP_AUTH \
  --auth-parameters USERNAME="petitioner1@example.com"',PASSWORD'="Testing1234$")
taxpayerToken=$(echo "${response}" | jq -r ".AuthenticationResult.IdToken")

response=$(aws cognito-idp admin-initiate-auth \
  --user-pool-id "${USER_POOL_ID}" \
  --client-id "${CLIENT_ID}" \
  --region "${REGION}" \
  --auth-flow ADMIN_NO_SRP_AUTH \
  --auth-parameters USERNAME="petitionsclerk1@example.com"',PASSWORD'="Testing1234$")
petitionsclerkToken=$(echo "${response}" | jq -r ".AuthenticationResult.IdToken")


for i in $(seq 1 20);
do
  echo "creating case ${i}"
  petitionFileId=$(uuidgen)
  stinFileId=$(uuidgen)

  case=$(curl "https://efcms-${ENV}.${EFCMS_DOMAIN}/cases" \
    -H 'Accept: application/json, text/plain, */*' \
    -H "Authorization: Bearer ${taxpayerToken}" \
    -H 'Content-Type: application/json;charset=UTF-8' \
    --data-binary '{"petitionFileId":"'"${petitionFileId}"'","petitionMetadata":{"contactPrimary":{"countryType":"domestic","name":"Vernon Miranda","address1":"77 South Oak Lane","address2":"Asperiores consequat","address3":"Ipsum ab cum repelle","city":"Voluptatem aliquip c","postalCode":"23117","phone":"+1 (513) 248-2715","state":"TX","email":"taxpayer"},"wizardStep":"4","stinFile":{},"stinFileSize":115022,"searchError":false,"petitionFile":{},"petitionFileSize":115022,"hasIrsNotice":false,"caseType":"Innocent Spouse","filingType":"Myself","partyType":"Petitioner","contactSecondary":{},"procedureType":"Regular","preferredTrialCity":"Denver, Colorado"},"stinFileId":"'"${stinFileId}"'"}' \
    --compressed)
  caseId=$(echo "${case}" | jq -r ".caseId")

  aws s3 cp "./assets/small_pdf.pdf" "s3://${EFCMS_DOMAIN}-documents-${ENV}-us-east-1/${petitionFileId}"
  aws s3 cp "./assets/small_pdf.pdf" "s3://${EFCMS_DOMAIN}-documents-${ENV}-us-east-1/${stinFileId}"

  curl "https://efcms-${ENV}.${EFCMS_DOMAIN}/cases/${caseId}/send-to-irs-holding-queue" \
    -H 'Accept: application/json, text/plain, */*' \
    -H "Authorization: Bearer ${petitionsclerkToken}" \
    -H 'Content-Type: application/json;charset=UTF-8' \
    --data-binary '{}' \
    --compressed

  curl "https://efcms-${ENV}.${EFCMS_DOMAIN}/api/runBatchProcess" \
    -H 'Accept: application/json, text/plain, */*' \
    -H "Authorization: Bearer ${petitionsclerkToken}" \
    -H 'Content-Type: application/json;charset=UTF-8' \
    --data-binary '{}' \
    --compressed

  curl "https://efcms-${ENV}.${EFCMS_DOMAIN}/cases/${caseId}/set-to-ready-for-trial" \
    -X PUT \
    -H 'Accept: application/json, text/plain, */*' \
    -H "Authorization: Bearer ${petitionsclerkToken}" \
    -H 'Content-Type: application/json;charset=UTF-8' \
    --data-binary '{}' \
    --compressed
done

