::: STUFF TO DELETE :::
- cookieFormatting


::: STUFF TO UPDATE :::
- web-client/integration-tests/admissionsClerkCreatesPractitionerAccount.test.ts
- web-client/integration-tests/admissionsClerkCreatesPractitionerAccount.test.ts
- web-client/integration-tests/petitionerCreatesAccount.test.ts


::: STUFF TO DO :::
- Add refresh token cookie in the browser.
- error handling
- make it work for hosted envs (remove hard-coded )
- email verification flow

::: QUESTIONS :::
- Refresh Token TTL? (Shouldn't live for 30 days) 
  How long does someone need to remain logged in before being logged out?
- Revoke Refresh Token after Use
- How are going to make sure our auth is secure? Run scanners or pen testing? 

