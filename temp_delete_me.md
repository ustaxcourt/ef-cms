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

PROBLEM: Setting refresh token as an httpOnly cookie
- Fire off a request with the refreshToken to the api and have the api return a cookie header
- Find a library that can set cookies the right way
- Instead of calling cognito directly from the browser, create a /login route on the api so that the refreshToken can be set as a header in the response back
- Do we need HttpOnly for the cookie?
- Use localstore with manual expires check (additional expires key, value)
- Manually type in refresh token after an hour
- Only request refresh token if needed
