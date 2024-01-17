::: STUFF TO DO :::
- Finish all todos
- Fix tests
  - web-client/integration-tests/admissionsClerkCreatesPractitionerAccount.test.ts
  - Pa11y tests. Determine strategy for how to fix.
+ Extract error message strings into constants OR do something else.
+ Forgot password flow.
- Move `PostAuthentication_Authentication` from Cognito triggers to changePasswordInteractor
- Move loginProxy out of public directory

::: SOLO TO DO:::


::: QUESTIONS :::
- Cognito SRP auth flow
  - Leaning towards not implementing
  - Current discussion: There is a possibility we could accidentally log out plaintext passwords in CloudWatch. How can we prevent this from ever happening?
    - Prevent logs from being added to endpoints that accept a password (using lint rules?).
    - Deploy a new lambda for endpoints that accept a password and disable logs for that lambda. 
    - We could encrypt the password on the frontend and decrypt on the backend so that we never see plaintext of their password.
- How are going to make sure our auth is secure? Run scanners or pen testing? 
- What happens if someone creates an account, we deploy 10007, and THEN they try to verify it???

::: CONVERSATIONS TO HAVE :::
- Do we need to handle temporary password changes on login screen(when an admissions clerk creates account for practitioner. Granting e-access to a petitioner)? This happens when cognito forces a password update.
- When the user hits refresh, we cannot easily revoke old ID tokens when issuing a new ID token. The threat vector is limited to 1 hour though. 
  - This is not a problem when the user requests a new ID token because the old one has expired after an hour. 
  - Implementing a system around this is possible, it would require more refactoring to NOT break multi-tab workflows on DAWSON.
- DOD:  Refactor cognito so every account has and can be looked up by custom:userId. Extract application.getCognito() into application.getUserGateway();
  - Chris is OK with this, wants us to chat with Mike first.
::: WIP :::
- Create helper function to get userId from Cognito response