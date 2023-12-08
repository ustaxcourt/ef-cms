::: STUFF TO DELETE :::
- 


::: STUFF TO UPDATE :::
- web-client/integration-tests/admissionsClerkCreatesPractitionerAccount.test.ts
- web-client/integration-tests/admissionsClerkCreatesPractitionerAccount.test.ts
- web-client/integration-tests/petitionerCreatesAccount.test.ts


::: STUFF TO DO :::
- Add refresh token cookie in the browser.
- add test accounts to cognito local
- Figure out what to do with cognitoLocal.json
- error handling
- make it work for hosted envs (remove hard-coded )





What is public and private?
Public/Private
- Public - anyone that is unauthenticated and on the public website domain, localhost:5678
- private - someone that is authenticated and on the private website domain, localhost:1234

DAWSON
- Public - irsPractitioner, privatePractitioner, petitioner
- Private - court employee


Local Cognito Fixes
- Script which cleans up the .cognito/db/local_2pHzece7.json
- research cognito-local to see if we can define our users in.
- generate the .cognito/db/local_2pHzece7.json file everytime on startup using users.json as the seeds. gitignore .cognito/db/local_2pHzece7.json .
- make a golden copy which populates the .cognito/db/local_2pHzece7.json