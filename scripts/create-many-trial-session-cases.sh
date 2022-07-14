
#!/bin/bash

trialSessionId="d661c9c2-470b-4281-a74b-3fab3e028b0e"
token="eyJraWQiOiJHdlpmTStYR1BLSitwazNvNWZDcUpuMHNabVZlWnI5NjJ2UVRYMTcxV2F3PSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiS0V0RW9Ba1lmWHdmaGtYN3NBV1hxUSIsInN1YiI6IjRhNjFiNDkzLWFkNTYtNGE2Zi1hNzJiLTg1NDIzYmQ1YjFiNiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV8ySzYzVGpUenIiLCJjb2duaXRvOnVzZXJuYW1lIjoiNGE2MWI0OTMtYWQ1Ni00YTZmLWE3MmItODU0MjNiZDViMWI2Iiwib3JpZ2luX2p0aSI6ImZhZDU4ODZhLTdjZDMtNDc4Zi1hMTMyLTA5NWYyOGE0MmIyZiIsImF1ZCI6IjJqbm9pM3ViYzA4bmZoN3A5bjcyM2gycXA3IiwiZXZlbnRfaWQiOiIzZjhkNWUzMy02ZWIyLTRjZDktOTk3Ni1iZmI3YzFiN2QyZTUiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY1NzgxNzg3NiwibmFtZSI6IlRlc3QgcGV0aXRpb25zY2xlcmsxIiwiZXhwIjoxNjU3ODMyNzcxLCJjdXN0b206cm9sZSI6InBldGl0aW9uc2NsZXJrIiwiaWF0IjoxNjU3ODI5MTcxLCJqdGkiOiI4NTY5MWNkYy01YjUwLTQwMDAtODk1My1mMDkzNjcxYjc4ZDAiLCJlbWFpbCI6InBldGl0aW9uc2NsZXJrMUBleGFtcGxlLmNvbSJ9.Sqdvl-Dbov3APjx-RjWoyB7K-ru4-OrjyxlUCu7rlcpD_99wwazI0w4fXls4_6hoO8ug2g_xCqPeXK0HjpKAhoAkeNULQEo2JgMfsJvmwR9P7qmWPrGudtoP0yxEbBZlsjXMJxCU4G-RBWbRFX6K0hnaPJmJ1BLy_cwlaSD0L9l8txDr_wWk9kk3VSq2mQa_NxcEkL4ZZg5AXdOTxhpgVLlUvMxttyAVXPnbEfgpoFuWktlFmkOG80qMYOMLLTnALBP3B-o6B32IrqmYn917W43lv0LTHNwC53DYZ8E3xe2Y3wf9TELBSn-44Ep4hbFXVa4qpUHtM45IznMSeRa70Q"

createCaseAndAddToTrialSession(){
   docketNumber=$(curl 'https://api-blue.exp5.ustc-case-mgmt.flexion.us/cases/paper' \
    -H 'authority: api-blue.exp5.ustc-case-mgmt.flexion.us' \
    -H 'accept: application/json, text/plain, */*' \
    -H 'accept-language: en-US,en;q=0.9' \
    -H "authorization: Bearer $token" \
    -H 'cache-control: no-cache' \
    -H 'content-type: application/json' \
    -H 'dnt: 1' \
    -H 'origin: https://app.exp5.ustc-case-mgmt.flexion.us' \
    -H 'pragma: no-cache' \
    -H 'sec-ch-ua: ".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"' \
    -H 'sec-ch-ua-mobile: ?0' \
    -H 'sec-ch-ua-platform: "macOS"' \
    -H 'sec-fetch-dest: empty' \
    -H 'sec-fetch-mode: cors' \
    -H 'sec-fetch-site: same-site' \
    -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36' \
    --data-raw '{"petitionFileId":"5041d64a-7915-4ba3-964a-4c85ad295b4e","petitionMetadata":{"contactPrimary":{"countryType":"domestic","name":"Kelsie Taylor","address1":"811 Milton Road","address2":"Iusto quam consequat","address3":"Repellendus Tenetur","city":"Exercitation repelle","postalCode":"36589","phone":"+1 (778) 202-3151","state":"KY"},"procedureType":"Regular","hasVerifiedIrsNotice":false,"orderDesignatingPlaceOfTrial":false,"statistics":[],"partyType":"Petitioner","orderForOds":false,"petitionFile":{},"petitionFileSize":3028,"requestForPlaceOfTrialFile":{},"requestForPlaceOfTrialFileSize":3028,"caseCaption":"Kelsie Taylor, Petitioner","mailingDate":"24-Jul-1994","orderToShowCause":true,"petitionPaymentStatus":"Not paid","orderForFilingFee":true,"orderForAmendedPetitionAndFilingFee":true,"preferredTrialCity":"Dallas, Texas","caseType":"Innocent Spouse","receivedAt":"2022-07-04T04:00:00.000Z","petitionPaymentDate":null,"petitionPaymentWaivedDate":null},"requestForPlaceOfTrialFileId":"c732f6b4-b654-49cd-90ff-f2443f79d8a7"}' \
    --compressed | jq -r '.docketNumber')

  curl "https://api-blue.exp5.ustc-case-mgmt.flexion.us/cases/$docketNumber/serve-to-irs" \
    -X 'POST' \
    -H 'authority: api-blue.exp5.ustc-case-mgmt.flexion.us' \
    -H 'accept: application/json, text/plain, */*' \
    -H 'accept-language: en-US,en;q=0.9' \
    -H "authorization: Bearer $token" \
    -H 'cache-control: no-cache' \
    -H 'content-length: 0' \
    -H 'dnt: 1' \
    -H 'origin: https://app.exp5.ustc-case-mgmt.flexion.us' \
    -H 'pragma: no-cache' \
    -H 'sec-ch-ua: ".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"' \
    -H 'sec-ch-ua-mobile: ?0' \
    -H 'sec-ch-ua-platform: "macOS"' \
    -H 'sec-fetch-dest: empty' \
    -H 'sec-fetch-mode: cors' \
    -H 'sec-fetch-site: same-site' \
    -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36' \
    --compressed

  curl "https://api-blue.exp5.ustc-case-mgmt.flexion.us/trial-sessions/$trialSessionId/cases/$docketNumber" \
    -H 'authority: api-blue.exp5.ustc-case-mgmt.flexion.us' \
    -H 'accept: application/json, text/plain, */*' \
    -H 'accept-language: en-US,en;q=0.9' \
    -H "authorization: Bearer $token" \
    -H 'cache-control: no-cache' \
    -H 'content-type: application/json' \
    -H 'dnt: 1' \
    -H 'origin: https://app.exp5.ustc-case-mgmt.flexion.us' \
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

for i in {1..3}; do
  createCaseAndAddToTrialSession &
  sleep 2
done




