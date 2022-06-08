# Update Practitioner User Endpoint

## Introduction

This endpoint was updated as part of story #7377 in order to allow updating 
legacy practitioner users' email addresses who did not have one previously 
in Blackstone. 

## Example Request

Request Type: PUT

Endpoint: https://api-"CURRENT_COLOR"."EFCMS_DOMAIN"/async/practitioners/"PRACTITIONERS_BAR_NUMBER"

Payload:
```
{
   "user":{
      "entityName":"Practitioner",
      "name":"Test V. Practitioner",
      "role":"privatePractitioner",
      "userId":"8380f5f4-6c0d-4873-a3f6-17ac0a23216a",
      "contact":{
         "address1":"Suite 111 1st Floor",
         "address2":"123 Main Street",
         "address3":null,
         "city":"Somewhere",
         "countryType":"domestic",
         "phone":"1234567890",
         "postalCode":"48839",
         "state":"TN"
      },
      "admissionsDate":"1991-01-11T05:00:00.000Z",
      "admissionsStatus":"Active",
      "barNumber":"PRACTITIONERS_BAR_NUMBER",
      "birthYear":1970,
      "employer":"Private",
      "firstName":"Test",
      "lastName":"Practitioner",
      "middleName":"V.",
      "originalBarState":"TN",
      "practitionerType":"Attorney",
      "section":"privatePractitioner",
      "serviceIndicator":"Electronic",
      "month":"1",
      "day":"11",
      "year":"1991",
      "email":"newemail@example.com"
   }
}
```
