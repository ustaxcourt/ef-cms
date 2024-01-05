::: STUFF TO DELETE :::


::: STUFF TO UPDATE :::
- web-client/integration-tests/admissionsClerkCreatesPractitionerAccount.test.ts
- web-client/integration-tests/admissionsClerkCreatesPractitionerAccount.test.ts
- web-client/integration-tests/petitionerCreatesAccount.test.ts


::: STUFF TO DO :::
- finish all todos (review together - KS)
- ensure back works right (public to private and back)
- fix tests
+ email verification flow (just after verifying, are we going to new login with verification success message)
- Refactor ifHasAccess Function to be handled by router + initSequence 
- Refactor maintenance mode to be handled by router + initSequence. No other sequence needs to branch because of it.
- invalidate old refreshToken and idToken upon refresh.
- Ensure idToken lasts longer than how often we are refreshing the idToken (REFRESH_INTERVAL)
- We need to handle temporary password changes on login screen. This happens when cognito forces a password update.
- disable cognito emails.
- resend confirmation code.



::: SOLO TO DO :::
- create account (move to private - client site) 

::: ON HOLD :::
- In refreshAuthTokenInteractor we are returning the idToken. Should this be an accessToken? Are all of our requests being authed with an idToken?


::: QUESTIONS :::
- Refresh Token TTL? (Shouldn't live for 30 days) 
  How long does someone need to remain logged in before being logged out?
- Revoke Refresh Token after Use
- How are going to make sure our auth is secure? Run scanners or pen testing? 


::: IDEAS :::
- when navigating to login sequence try and exchange idToken
- ifHasAccess only does static checks and redirects. Create an initSequence which is responsible for doing all fetching for app. (exchange idToken, get feature flags, get maintenance mode, get user, startRefreshIntervalSequence)
