::: STUFF TO DO :::
- Finish all todos
- Fix tests
  - web-client/integration-tests/admissionsClerkCreatesPractitionerAccount.test.ts
+ Extract error message strings into constants OR do something else. (On hold)
+ Forgot password flow.
- Move `PostAuthentication_Authentication` from Cognito triggers to changePasswordInteractor
- Move loginProxy out of public directory

::: SOLO TO DO:::


::: QUESTIONS :::

- How are going to make sure our auth is secure? Run scanners or pen testing? 
- What happens if someone creates an account, we deploy 10007, and THEN they try to verify it???

::: CONVERSATIONS TO HAVE :::
- DOD:  Refactor cognito so every account has and can be looked up by custom:userId. Extract application.getCognito() into application.getUserGateway();
  - Chris is OK with this, wants us to chat with Mike first.

::: WIP :::
- Create helper function to get userId from Cognito response