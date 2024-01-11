::: STUFF TO DO :::
- finish all todos
- ensure back button works right on login
- fix tests
  - web-client/integration-tests/admissionsClerkCreatesPractitionerAccount.test.ts
  - web-client/integration-tests/petitionerCreatesAccount.test.ts
- invalidate old refreshToken and idToken upon refresh.
- We need to handle temporary password changes on login screen(when an admissions clerk creates account for practitioner. Granting e-access to a petitioner. Forgot password). This happens when cognito forces a password update.
- API Gateway requires re-deploy so that /system/* routes do not require authorizer.
- (KS & RR - need to review with UX) Handle what happens if a user clicks an expired confirmation email: 
  - On login to an unconfirmed account immediately send an email to the user
  - Expire link after 24hours
  - If user clicks on an expired email then redirect them to the login and tell them to sign in so that we can send a new confirmation with a new confirmation code.
- cognito srp auth flow. Research.
- userId, sub, email, username cognito . idk you figure it out.

::: SOLO TO DO:::
- Email Verification email is ugly.

::: QUESTIONS :::
- How are going to make sure our auth is secure? Run scanners or pen testing? 
