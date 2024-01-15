::: STUFF TO DO :::
- Finish all todos
- Back button navigation does not work between public and private
- Fix tests
  - web-client/integration-tests/admissionsClerkCreatesPractitionerAccount.test.ts
+ Handle what happens if a user clicks an expired confirmation email: 
  - On login to an unconfirmed account immediately send an email to the user
  - Expire link after 24hours
  - If user clicks on an expired email then redirect them to the login and tell them to sign in so that we can send a new confirmation with a new confirmation code.
- Cognito srp auth flow. Research.
- userId, sub, email, username cognito . idk you figure it out.
- Ensure incorrect login message appears on hosted env, didn't see this on our last test.
- Unify error handling for loginInteractor, signUpUserInteractor. err.responseCode, err.name, err.message?

::: SOLO TO DO:::


::: QUESTIONS :::
- How are going to make sure our auth is secure? Run scanners or pen testing? 
- What happens if someone creates an account, we deploy 10007, and THEN they try to verify it???


::: CONVERSATIONS TO HAVE :::
- Do we need to handle temporary password changes on login screen(when an admissions clerk creates account for practitioner. Granting e-access to a petitioner)? This happens when cognito forces a password update.
- When the user hits refresh, we cannot easily revoke old ID tokens when issuing a new ID token. The threat vector is limited to 1 hour though. 
  - This is not a problem when the user requests a new ID token because the old one has expired after an hour. 
  - Implementing a system around this is possible, it would require more refactoring to NOT break multi-tab workflows on DAWSON.
- DOD:  Refactor cognito so every account has and can be looked up by custom:userId.
  
::: WIP :::
- Create helper function to get userId from Cognito response