::: STUFF TO DO :::
- Finish all todos
- Fix tests
  - web-client/integration-tests/admissionsClerkCreatesPractitionerAccount.test.ts
  - Pa11y tests. Determine strategy for how to fix.
- Cognito srp auth flow. Research.
- Extract error message strings into constants OR do something else.
- Fix redirect_url in cognito links

::: SOLO TO DO:::


::: QUESTIONS :::
- How are going to make sure our auth is secure? Run scanners or pen testing? 
- What happens if someone creates an account, we deploy 10007, and THEN they try to verify it???


::: CONVERSATIONS TO HAVE :::
- Do we need to handle temporary password changes on login screen(when an admissions clerk creates account for practitioner. Granting e-access to a petitioner)? This happens when cognito forces a password update.
- When the user hits refresh, we cannot easily revoke old ID tokens when issuing a new ID token. The threat vector is limited to 1 hour though. 
  - This is not a problem when the user requests a new ID token because the old one has expired after an hour. 
  - Implementing a system around this is possible, it would require more refactoring to NOT break multi-tab workflows on DAWSON.
- DOD:  Refactor cognito so every account has and can be looked up by custom:userId. Extract application.getCognito() into application.getUserGateway();
  
::: WIP :::
- Create helper function to get userId from Cognito response