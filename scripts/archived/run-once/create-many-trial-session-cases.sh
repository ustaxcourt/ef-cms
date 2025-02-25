#!/bin/bash
# shellcheck disable=SC1009
# shellcheck disable=SC1073
# shellcheck disable=SC2086


trialSessionId="[INSERT ID HERE]"
token="[INSERT TOKEN HERE]"
targetExperimentalEnvironment="[INSERT ENV HERE]"
currentColor="[INSERT COLOR HERE]"
hostName="api-${currentColor}.${targetExperimentalEnvironment}.ustc-case-mgmt.flexion.us"
baseUrl="https://${hostName}"
petitionFileId="[INSERT ID HERE]"
numberOfCasesToCreate=5

createCaseAndAddToTrialSession(){
  local docketNumber
  docketNumber=$(curl -s "${baseUrl}/cases/paper" \
    -H "authority: ${hostName}" \
    -H 'accept: application/json, text/plain, */*' \
    -H 'accept-language: en-US,en;q=0.9,ar;q=0.8' \
    -H "authorization: Bearer ${token}" \
    -H 'content-type: application/json' \
    -H "origin: ${hostName}" \
    -H 'sec-ch-ua: "Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"' \
    -H 'sec-ch-ua-mobile: ?0' \
    -H 'sec-ch-ua-platform: "macOS"' \
    -H 'sec-fetch-dest: empty' \
    -H 'sec-fetch-mode: cors' \
    -H 'sec-fetch-site: same-site' \
    -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36' \
    --data-raw '{"petitionFileId":"'$petitionFileId'","petitionMetadata":{"contactPrimary":{"countryType":"domestic","name":"Rachel Foreman","address1":"688 Green Nobel Road","address2":"Rerum atque facere q","address3":"Deleniti explicabo ","city":"In est tempor adipis","postalCode":"38854","phone":"+1 (266) 459-9362","state":"NJ"},"procedureType":"Regular","hasVerifiedIrsNotice":false,"orderDesignatingPlaceOfTrial":true,"statistics":[],"isPaper":true,"partyType":"Petitioner","orderForCds":false,"petitionFile":{},"petitionFileSize":3028,"caseCaption":"Rachel Foreman, Petitioner","mailingDate":"Test","petitionPaymentStatus":"Paid","orderForFilingFee":false,"paymentDateDay":"29","paymentDateMonth":"05","paymentDateYear":"2023","petitionPaymentMethod":"Check","caseType":"Other","receivedAt":"2023-05-28T04:00:00.000Z","petitionPaymentDate":"2023-05-29T04:00:00.000Z","petitionPaymentWaivedDate":null}}' \
    --compressed | jq -r '.docketNumber')

  echo "created case $docketNumber"

  curl -s "${baseUrl}/cases/$docketNumber/serve-to-irs" \
    -X 'POST' \
    -H "authority: ${hostName}" \
    -H 'accept: application/json, text/plain, */*' \
    -H 'accept-language: en-US,en;q=0.9' \
    -H "authorization: Bearer $token" \
    -H 'cache-control: no-cache' \
    -H 'content-length: 0' \
    -H 'dnt: 1' \
    -H "origin: ${baseUrl}" \
    -H 'pragma: no-cache' \
    -H 'sec-ch-ua: ".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"' \
    -H 'sec-ch-ua-mobile: ?0' \
    -H 'sec-ch-ua-platform: "macOS"' \
    -H 'sec-fetch-dest: empty' \
    -H 'sec-fetch-mode: cors' \
    -H 'sec-fetch-site: same-site' \
    -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36' \
    --compressed

  echo "served case $docketNumber"

  curl "${baseUrl}/trial-sessions/$trialSessionId/cases/$docketNumber" \
    -H "authority: ${hostName}" \
    -H 'accept: application/json, text/plain, */*' \
    -H 'accept-language: en-US,en;q=0.9' \
    -H "authorization: Bearer $token" \
    -H 'cache-control: no-cache' \
    -H 'content-type: application/json' \
    -H 'dnt: 1' \
    -H "origin: ${baseUrl}" \
    -H 'pragma: no-cache' \
    -H 'sec-ch-ua: ".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"' \
    -H 'sec-ch-ua-mobile: ?0' \
    -H 'sec-ch-ua-platform: "macOS"' \
    -H 'sec-fetch-dest: empty' \
    -H 'sec-fetch-mode: cors' \
    -H 'sec-fetch-site: same-site' \
    -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36' \
    --data-raw '{}' \
    --compressed

  echo "added case $docketNumber to trial session"

}


for i in $( seq 0 $numberOfCasesToCreate ); do
  createCaseAndAddToTrialSession &
  sleep 2

  echo -e "\n${i} of ${numberOfCasesToCreate}\n"
done

echo -e "\nFINISHED"


