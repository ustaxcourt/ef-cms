::: STUFF TO DELETE :::



::: STUFF TO UPDATE :::
- web-client/integration-tests/admissionsClerkCreatesPractitionerAccount.test.ts
- web-client/integration-tests/admissionsClerkCreatesPractitionerAccount.test.ts
- web-client/integration-tests/petitionerCreatesAccount.test.ts
- cookieFormatting


::: STUFF TO DO :::
- finish all todos
- consistent (Login vs LogInInteractor)
- private (client) redirect if not logged
- fix /login route where matches on .includes()
- error handling
- fix tests
- make it work for hosted envs (remove hard-coded )
- email verification flow (just after verifying, are we going to new login with verification success message)
- create account (move to private - client site)
- In refreshAuthTokenInteractor we are returning the idToken. Should this be an accessToken? Are all of our requests being authed with an idToken?

::: QUESTIONS :::
- Refresh Token TTL? (Shouldn't live for 30 days) 
  How long does someone need to remain logged in before being logged out?
- Revoke Refresh Token after Use
- How are going to make sure our auth is secure? Run scanners or pen testing? 

