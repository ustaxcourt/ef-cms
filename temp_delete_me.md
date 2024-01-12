::: STUFF TO DO :::
- Finish all todos
- Back button navigation does not work between public and private
- Fix tests
  - web-client/integration-tests/admissionsClerkCreatesPractitionerAccount.test.ts
- We need to handle temporary password changes on login screen(when an admissions clerk creates account for practitioner. Granting e-access to a petitioner. Forgot password). This happens when cognito forces a password update.
- Handle what happens if a user clicks an expired confirmation email: 
  - On login to an unconfirmed account immediately send an email to the user
  - Expire link after 24hours
  - If user clicks on an expired email then redirect them to the login and tell them to sign in so that we can send a new confirmation with a new confirmation code.
- Cognito srp auth flow. Research.
- userId, sub, email, username cognito . idk you figure it out.

::: SOLO TO DO:::
- Email Verification email is ugly.

::: QUESTIONS :::
- How are going to make sure our auth is secure? Run scanners or pen testing? 


::: CONVERSATIONS TO HAVE :::
- When the user hits refresh, we cannot easily revoke old ID tokens when issuing a new ID token. The threat vector is limited to 1 hour though. 
  - This is not a problem when the user requests a new ID token because the old one has expired after an hour. 
  - Implementing a system around this is possible, it would require more refactoring to NOT break multi-tab workflows on DAWSON.
  
::: WIP :::
- Create helper function to get userId from Cognito response
