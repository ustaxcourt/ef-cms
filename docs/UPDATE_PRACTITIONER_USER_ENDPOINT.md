# Update Practitioner User Endpoint

## Introduction

This endpoint was updated as part of story #7377 in order to allow updating 
legacy practitioner users' email addresses who did not have one previously 
in Blackstone. 

## Example Request

curl 'https://api-${CURRENT_COLOR}.${EFCMS_DOMAIN}/async/practitioners/${BAR_NUMBER}' \
  -X 'PUT' \
  -H 'authority: api-${CURRENT_COLOR}.${EFCMS_DOMAIN}' \
  -H 'pragma: no-cache' \
  -H 'cache-control: no-cache' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'authorization: Bearer ${TOKEN}' \
  -H 'content-type: application/json;charset=UTF-8' \
  -H 'origin: https://app.${EFCMS_DOMAIN}' \
  -H 'sec-fetch-site: same-site' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-dest: empty' \
  -H 'accept-language: en-US,en;q=0.9' \
  --data-binary '{"user":{"entityName":"Practitioner","name":"Test V. Practitioner","role":"privatePractitioner","userId":"926c06c2-1cc9-442a-91ed-b1a5e5f199d7","contact":{"address1":"Suite 111 1st Floor","address2":"123 Main Street","address3":null,"city":"Somewhere","countryType":"domestic","phone":"1234567890","postalCode":"48839","state":"TN"},"admissionsDate":"1991-01-11T05:00:00.000Z","admissionsStatus":"Active","barNumber":"AB7631","birthYear":1970,"employer":"Private","firstName":"Test","lastName":"Practitioner","middleName":"V.","originalBarState":"TN","practitionerType":"Attorney","section":"privatePractitioner","serviceIndicator":"Electronic","month":"1","day":"11","year":"1991","email":"test@example.com"}}' \
  --compressed
