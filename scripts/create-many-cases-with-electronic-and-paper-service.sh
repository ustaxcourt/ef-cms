#!/bin/bash
# shellcheck disable=SC1073

# login token. pull from a request header after logging in.
# for this script the tokens should be from a petitioner account and from
# petitionsclerk account.
petitionerToken="[PLACE TOKEN HERE]"
petitionsClerkToken="[PLACE TOKEN HERE]"
targetExperimentalEnvironment="[EXP OF CHOICE]"
currentColor="[CURRENT COLOR OF EXP]"
hostName="api-${currentColor}.${targetExperimentalEnvironment}.ustc-case-mgmt.flexion.us"
baseUrl="https://${hostName}"
# these Id's must be valid. Can pull from a newly created case.
trialSessionId="[PLACE TRIAL SESSION ID HERE]"
petitionFileIdForElectronicService="[PLACE HERE]"
petitionFileIdForPaperService="[PLACE HERE]"
stinFileId="[PLACE HERE]"
requestForPlaceOfTrialFileId="[PLACE HERE]"
# numberOfCases to create starts counting from 0, so a value of 9 will create 10 cases
numberOfElectronicCasesToCreate=74
numberOfPaperCasesToCreate=171
actualNumberOfElectronicCases=${numberOfElectronicCasesToCreate+1}
actualNumberOfPaperCases=${numberOfPaperCasesToCreate+1}


createCaseWithElectronicServiceAndAddToTrialSession(){
  docketNumberWithElectronicService=$(curl "${baseUrl}/cases" \
  -H "authority: ${hostName}" \
  -H 'accept: application/json, text/plain, */*' \
  -H 'accept-language: en-US,en;q=0.9' \
  -H "authorization: Bearer $petitionerToken" \
  -H 'content-type: application/json' \
  -H 'dnt: 1' \
  -H "origin: ${baseUrl}" \
  -H 'sec-ch-ua: ".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-site' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36' \
  --data-raw '{"petitionFileId":"'"$petitionFileIdForElectronicService"'","petitionMetadata":{"contactPrimary":{"countryType":"domestic","name":"Thor deMarvel","address1":"12345 Main St","city":"El Paso","state":"TX","postalCode":"79938","phone":"123456789","email":"tshumway+petitioner1@flexion.us"},"wizardStep":"5","stinFile":{},"stinFileSize":145709,"petitionFile":{},"petitionFileSize":145709,"hasIrsNotice":false,"caseType":"Other","filingType":"Myself","partyType":"Petitioner","contactSecondary":{},"procedureType":"Regular","preferredTrialCity":"El Paso, Texas"},"stinFileId":"'"$stinFileId"'"}' \
  --compressed | jq -r '.docketNumber')

  echo -e "\n\nDOCKET NUMBER: ${docketNumberWithElectronicService} CREATED\n\n"

  curl "${baseUrl}/trial-sessions/$trialSessionId/cases/$docketNumberWithElectronicService" \
    -H "authority: ${hostName}" \
    -H 'accept: application/json, text/plain, */*' \
    -H 'accept-language: en-US,en;q=0.9' \
    -H "authorization: Bearer $petitionsClerkToken" \
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

  echo -e "\n\nDOCKET NUMBER: ${docketNumberWithElectronicService} ADDED TO TRIAL SESSION\n\n"
}

createCaseWithPaperServiceAndAddToTrialSession(){
  docketNumberWithPaperService=$(curl "${baseUrl}/cases/paper" \
    -H "authority: ${hostName}" \
    -H 'accept: application/json, text/plain, */*' \
    -H 'accept-language: en-US,en;q=0.9' \
    -H "authorization: Bearer $petitionsClerkToken" \
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
    --data-raw '{"petitionFileId":"'"$petitionFileIdForPaperService"'","petitionMetadata":{"contactPrimary":{"countryType":"domestic","name":"Kelsie Taylor","address1":"811 Milton Road","address2":"Iusto quam consequat","address3":"Repellendus Tenetur","city":"Exercitation repelle","postalCode":"36589","phone":"+1 (778) 202-3151","state":"KY"},"procedureType":"Regular","hasVerifiedIrsNotice":false,"orderDesignatingPlaceOfTrial":false,"statistics":[],"partyType":"Petitioner","orderForCds":false,"petitionFile":{},"petitionFileSize":3028,"requestForPlaceOfTrialFile":{},"requestForPlaceOfTrialFileSize":3028,"caseCaption":"Kelsie Taylor, Petitioner","mailingDate":"24-Jul-1994","orderToShowCause":true,"petitionPaymentStatus":"Not paid","orderForFilingFee":true,"orderForAmendedPetitionAndFilingFee":true,"preferredTrialCity":"Dallas, Texas","caseType":"Innocent Spouse","receivedAt":"2022-07-04T04:00:00.000Z","petitionPaymentDate":null,"petitionPaymentWaivedDate":null},"requestForPlaceOfTrialFileId":"'"$requestForPlaceOfTrialFileId"'"}' \
    --compressed | jq -r '.docketNumber')

  echo -e "\n\nDOCKET NUMBER: ${docketNumberWithPaperService} CREATED\n\n"

  curl "${baseUrl}/cases/$docketNumberWithPaperService/serve-to-irs" \
    -X 'POST' \
    -H "authority: ${hostName}" \
    -H 'accept: application/json, text/plain, */*' \
    -H 'accept-language: en-US,en;q=0.9' \
    -H "authorization: Bearer $petitionsClerkToken" \
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

  echo -e "\n\nDOCKET NUMBER: ${docketNumberWithPaperService} SERVED TO IRS\n\n"

  curl "${baseUrl}/trial-sessions/$trialSessionId/cases/$docketNumberWithPaperService" \
    -H "authority: ${hostName}" \
    -H 'accept: application/json, text/plain, */*' \
    -H 'accept-language: en-US,en;q=0.9' \
    -H "authorization: Bearer $petitionsClerkToken" \
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

    echo -e "\n\nDOCKET NUMBER: ${docketNumberWithPaperService} ADDED TO TRIAL SESSION\n\n"
}

for i in $( seq 0 $numberOfElectronicCasesToCreate ); do
  createCaseWithElectronicServiceAndAddToTrialSession &
  sleep 3

  currentCaseNumber=${i+1}

  echo -e "\n\nCASE ${currentCaseNumber} OF ${actualNumberOfElectronicCases} CREATED\n\n"
done

echo -e "\n\nFINISHED ELECTRONIC CASES"

sleep 5

for i in $( seq 0 $numberOfPaperCasesToCreate ); do
  createCaseWithPaperServiceAndAddToTrialSession &
  sleep 3

  currentCaseNumber=${i+1}

  echo -e "\n\nCASE ${currentCaseNumber} OF ${actualNumberOfPaperCases} CREATED\n\n"
done

echo -e "\n\nFINISHED PAPER CASES\n"
