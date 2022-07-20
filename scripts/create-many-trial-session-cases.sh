#!/bin/bash

trialSessionId="86a18457-a7ba-45a8-a1e2-de9d6dcf2b0f"
token="eyJraWQiOiJRQzAwUFRsMjVicE1QYVFmQllOUDFudU5kSzlQYVBLRFkrRUgyZUlMZTkwPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiU3prbUI1ZFFhYl9hUERWQUlndG4yZyIsInN1YiI6IjMyMTZmMDRmLWRiMzAtNDQ0OC1hZjNhLTA0ZTRhNThkZWRkNyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9nU3VUckxZRHQiLCJjb2duaXRvOnVzZXJuYW1lIjoiMzIxNmYwNGYtZGIzMC00NDQ4LWFmM2EtMDRlNGE1OGRlZGQ3Iiwib3JpZ2luX2p0aSI6IjUxMjJjODI5LTIzYTUtNGRjYS1iNTRlLTQwODBhZDhmZjY0YiIsImF1ZCI6IjVvODM1ZXNkZnFrNW4zMzBtM2dpZ240MDBzIiwiZXZlbnRfaWQiOiJkYWEzMDYxZS1kNTI2LTQwOTAtYmU4Yy05YjJiNWQwMDk0NzMiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY1ODI1ODE4MywibmFtZSI6IlRlc3QgcGV0aXRpb25zY2xlcmsxIiwiZXhwIjoxNjU4MjYxNzgzLCJjdXN0b206cm9sZSI6InBldGl0aW9uc2NsZXJrIiwiaWF0IjoxNjU4MjU4MTgzLCJqdGkiOiI0YjkzN2YxOS1kYTZiLTQ4ZTEtYjM2ZS00NjE5NGIxNzgwZDgiLCJlbWFpbCI6InBldGl0aW9uc2NsZXJrMUBleGFtcGxlLmNvbSJ9.dVFe2xw4xzNVokbkbu838pasM-ObU5yw5P5g-UArPtZDI1G1-bLbD5auIugTO9FRKbBoCOr3X28BO1bhO1sBvYE8F3td_j8g8OCTOZqpo1TKe2JV4DpSxQE_ut0RkBxUSO-2mwsdUTbKCZxA5oR15Dv6U65ZZ24YmqbkqUxMG-ZXta2Kd86Bk6ZOD2YMbA6aDBWhGP45qzzS6tmFqCkMKw4wf_3gTZXRviL2JX163lzfgETxhbZsC83Vdw2CVWZ0mFcbCEvmkqmD8OSSNjPquHCW3iNRkfZcxlLlFbz_sWA8-fa-qKzjXeYovet5ooyWZ8OXwxjq5X0DOJ6VbQstMA"
targetExperimentalEnvironment='exp4'
currentColor='blue'
hostName="api-${currentColor}.${targetExperimentalEnvironment}.ustc-case-mgmt.flexion.us"
baseUrl="https://${hostName}"
petitionFileId='d92a771d-a02a-4198-b4f0-9108d56a14a0'
requestForPlaceOfTrialFileId='328372b3-62a2-4dbb-b110-56a8f39823e3'
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


