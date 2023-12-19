::: STUFF TO DELETE :::


::: STUFF TO UPDATE :::
- web-client/integration-tests/admissionsClerkCreatesPractitionerAccount.test.ts
- web-client/integration-tests/admissionsClerkCreatesPractitionerAccount.test.ts
- web-client/integration-tests/petitionerCreatesAccount.test.ts
- web-client/src/presenter/sequences/loginWithTokenSequence.ts
- web-client/src/presenter/sequences/Login/refreshTokenSequence.ts


::: STUFF TO DO :::
- finish all todos
- ensure back works right (public to private and back)
- Handle maintenance mode on login in app.tsx
- error handling
- fix tests
- email verification flow (just after verifying, are we going to new login with verification success message)
- create account (move to private - client site)
- Refactor ifHasAccess Function and delete isLoggedInAction.
- invalidate old refreshToken and idToken upon refresh.
- Ensure idToken lasts longer than how often we are refreshing the idToken (REFRESH_INTERVAL)
- Make app-local.ts not create another webserver just to listen to incoming requests from cognito-local.

::: SOLO TO DO :::
- consistent (LoginInteractor). Lets go with Login.


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
