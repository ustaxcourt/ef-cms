::: STUFF TO DO :::
- Finish all todos
- Fix tests
  - web-api/terraform/template/lambdas/cognito-triggers.ts
+ Extract error message strings into constants OR do something else. (On hold)
+ Forgot password flow.
- Figure out how to avoid lack of spinner when redirecting to login from public site
- Swagger docs: Move to delete. Ask people to do so.
- confirm user could timeout when associating a brand new person.
- Verify /health displays correct value for cognito for east and west.
- Test addExistingUser to case on exp2

::: QUESTIONS :::
- What happens if someone creates an account, we deploy 10007, and THEN they try to verify it?
- How do we make forgot password more secure? 
- Have we covered one of two scenarios mentioned in 10007 comments by Tenille?

::: DOD :::
- Refactor cognito so every account has and can be looked up by custom:userId. Extract application.getCognito() into application.getUserGateway();
- Refactor getCognito to be more generic - "getAuthenticationGateway"
  - Abstract away from cognito specific syntax in interactors
- Remove createUserInteractor() and createOrUpdateUser(). Make bulkimportjudgeusrs do its own thing.
