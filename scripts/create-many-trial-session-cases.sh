#!/bin/bash
# shellcheck disable=SC1009
# shellcheck disable=SC1073
# shellcheck disable=SC2086


trialSessionId="[PLACE TOKEN HERE]"
token="[PLACE TOKEN HERE]"
targetExperimentalEnvironment="[EXP OF CHOICE]"
currentColor="[CURRENT COLOR OF EXP]"
hostName="api-${currentColor}.${targetExperimentalEnvironment}.ustc-case-mgmt.flexion.us"
baseUrl="https://${hostName}"
petitionFileId="[PLACE HERE]"
requestForPlaceOfTrialFileId="[PLACE HERE]"
numberOfCasesToCreate=5

createCaseAndAddToTrialSession(){
   docketNumber=$(curl "${baseUrl}/cases/paper" \
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
    --data-raw '{"petitionFileId":"'$petitionFileId'","petitionMetadata":{"contactPrimary":{"countryType":"domestic","name":"Kelsie Taylor","address1":"811 Milton Road","address2":"Iusto quam consequat","address3":"Repellendus Tenetur","city":"Exercitation repelle","postalCode":"36589","phone":"+1 (778) 202-3151","state":"KY"},"procedureType":"Regular","hasVerifiedIrsNotice":false,"orderDesignatingPlaceOfTrial":false,"statistics":[],"partyType":"Petitioner","orderForOds":false,"petitionFile":{},"petitionFileSize":3028,"requestForPlaceOfTrialFile":{},"requestForPlaceOfTrialFileSize":3028,"caseCaption":"Kelsie Taylor, Petitioner","mailingDate":"24-Jul-1994","orderToShowCause":true,"petitionPaymentStatus":"Not paid","orderForFilingFee":true,"orderForAmendedPetitionAndFilingFee":true,"preferredTrialCity":"Dallas, Texas","caseType":"Innocent Spouse","receivedAt":"2022-07-04T04:00:00.000Z","petitionPaymentDate":null,"petitionPaymentWaivedDate":null},"requestForPlaceOfTrialFileId":"'$requestForPlaceOfTrialFileId'"}' \
    --compressed | jq -r '.docketNumber')

  curl "${baseUrl}/cases/$docketNumber/serve-to-irs" \
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
}


for i in $( seq 0 $numberOfCasesToCreate ); do
  createCaseAndAddToTrialSession &
  sleep 2

  echo -e "\n${i} of ${numberOfCasesToCreate}\n"
done

echo -e "\nFINISHED"


