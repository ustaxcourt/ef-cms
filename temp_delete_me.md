::: STUFF TO DO :::
- Finish all todos
- Fix tests
  - web-client/integration-tests/admissionsClerkCreatesPractitionerAccount.test.ts
  - web-api/terraform/template/lambdas/cognito-triggers.ts
+ Extract error message strings into constants OR do something else. (On hold)
+ Forgot password flow.

::: QUESTIONS :::
- How are going to make sure our auth is secure? Run scanners or pen testing? 
- What happens if someone creates an account, we deploy 10007, and THEN they try to verify it???

::: CONVERSATIONS TO HAVE :::
- DOD:  Refactor cognito so every account has and can be looked up by custom:userId. Extract application.getCognito() into application.getUserGateway();
  - Chris is OK with this, wants us to chat with Mike first.
