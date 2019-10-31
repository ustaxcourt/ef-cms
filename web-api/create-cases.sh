#!/bin/bash -e
ENV=$1
REGION="us-east-1"

USER_POOL_ID=$(aws cognito-idp list-user-pools --query "UserPools[?Name == 'efcms-${ENV}'].Id | [0]" --max-results 30 --region "${REGION}")
USER_POOL_ID="${USER_POOL_ID%\"}"
USER_POOL_ID="${USER_POOL_ID#\"}"

CLIENT_ID=$(aws cognito-idp list-user-pool-clients --user-pool-id "${USER_POOL_ID}" --query "UserPoolClients[?ClientName == 'client'].ClientId | [0]" --max-results 30 --region "${REGION}")
CLIENT_ID="${CLIENT_ID%\"}"
CLIENT_ID="${CLIENT_ID#\"}"

echo "" > cases.txt

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

while read -r line
do
  IFS=';' read -ra ADDR <<< "$line"
  partyType="${ADDR[0]}"
  caseType="${ADDR[1]}"
  primaryContact="${ADDR[2]}"
  secondaryContact="${ADDR[3]}"
  caseProcedure="${ADDR[4]}"
  placeOfTrial="${ADDR[5]}"
  respondentCounsel="${ADDR[6]/$'\r'}"
  petitionerCounsel="${ADDR[7]/$'\r'}"

  echo "creating case for ${primaryContact}"

  petitionFileId=$(uuidgen)
  stinFileId=$(uuidgen)

  secondaryContactJson="{}"
  if [ -n "$secondaryContact" ] ; then
    secondaryContactJson=$(cat <<EOF
{
  "countryType": "domestic",
  "name": "${secondaryContact}",
  "address1": "77 South Oak Lane",
  "address2": "Asperiores consequat",
  "address3": "Ipsum ab cum repelle",
  "city": "Voluptatem aliquip c",
  "postalCode": "23117",
  "phone": "+1 (513) 248-2715",
  "state": "TX",
  "email": "taxpayer"
}
EOF
)
  fi

  caseJson=$(cat <<EOF
{
  "petitionFileId": "${petitionFileId}",
  "stinFileId": "${stinFileId}",
  "petitionMetadata": {
    "contactPrimary": {
      "countryType": "domestic",
      "name": "${primaryContact}",
      "address1": "77 South Oak Lane",
      "address2": "Asperiores consequat",
      "address3": "Ipsum ab cum repelle",
      "city": "Voluptatem aliquip c",
      "postalCode": "23117",
      "phone": "+1 (513) 248-2715",
      "state": "TX",
      "email": "taxpayer"
    },
    "hasIrsNotice": false,
    "caseType": "${caseType}",
    "filingType": "Myself",
    "partyType": "${partyType}",
    "contactSecondary": ${secondaryContactJson},
    "procedureType": "${caseProcedure}",
    "preferredTrialCity": "${placeOfTrial}"
  }
}
EOF
  )

  echo "${caseJson}"

  case=$(curl "https://efcms-${ENV}.${EFCMS_DOMAIN}/cases" \
    -H 'Accept: application/json, text/plain, */*' \
    -H "Authorization: Bearer ${taxpayerToken}" \
    -H 'Content-Type: application/json;charset=UTF-8' \
    --compressed \
    -d "${caseJson}")

  caseId=$(echo "${case}" | jq -r ".caseId")
  docketNumber=$(echo "${case}" | jq -r ".docketNumber")
  echo "${docketNumber} ${caseId}" >> cases.txt

  aws s3 cp ./assets/small_pdf.pdf "s3://${EFCMS_DOMAIN}-documents-${ENV}-us-east-1/${petitionFileId}"
  aws s3 cp ./assets/small_pdf.pdf "s3://${EFCMS_DOMAIN}-documents-${ENV}-us-east-1/${stinFileId}"

  if [ -n "$petitionerCounsel" ] ; then
    if [ "$petitionerCounsel" == 'practitioner1' ] ; then
      barNumber="PT1234"
    fi
    if [ "$petitionerCounsel" == 'practitioner2' ] ; then
      barNumber="PT5432"
    fi

    searchResults=$(curl "https://efcms-${ENV}.${EFCMS_DOMAIN}/users/practitioners/search?searchKey=${barNumber}" \
      -H 'Accept: application/json, text/plain, */*' \
      -H "Authorization: Bearer ${petitionsclerkToken}" \
      -H 'Content-Type: application/json;charset=UTF-8'
    )

    practitionerId=$(echo "${searchResults}" | jq -r ".[0].userId")

    associateBodyJson=$(cat <<EOF
{
  "caseId": "${caseId}",
  "representingPrimary": true,
  "userId": "${practitionerId}"
}
EOF
)

    curl "https://efcms-${ENV}.${EFCMS_DOMAIN}/cases/${caseId}/associate-practitioner" \
      -H 'Accept: application/json, text/plain, */*' \
      -H "Authorization: Bearer ${petitionsclerkToken}" \
      -H 'Content-Type: application/json;charset=UTF-8' \
      --data-binary "${associateBodyJson}" \
      --compressed
  fi

  if [ -n "$respondentCounsel" ] ; then
    if [ "$respondentCounsel" == 'respondent1' ] ; then
      barNumber="RT6789"
    fi
    if [ "$respondentCounsel" == 'respondent2' ] ; then
      barNumber="RT0987"
    fi

    searchResults=$(curl "https://efcms-${ENV}.${EFCMS_DOMAIN}/users/respondents/search?searchKey=${barNumber}" \
      -H 'Accept: application/json, text/plain, */*' \
      -H "Authorization: Bearer ${petitionsclerkToken}" \
      -H 'Content-Type: application/json;charset=UTF-8'
    )

    respondentId=$(echo "${searchResults}" | jq -r ".[0].userId")

    associateBodyJson=$(cat <<EOF
{
  "caseId": "${caseId}",
  "userId": "${respondentId}"
}
EOF
)

    curl "https://efcms-${ENV}.${EFCMS_DOMAIN}/cases/${caseId}/associate-respondent" \
      -H 'Accept: application/json, text/plain, */*' \
      -H "Authorization: Bearer ${petitionsclerkToken}" \
      -H 'Content-Type: application/json;charset=UTF-8' \
      --data-binary "${associateBodyJson}" \
      --compressed
  fi

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

done < ux_testing_data.csv
