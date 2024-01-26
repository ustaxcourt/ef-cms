::: STUFF TO DO :::
- Fix tests
  - web-api/terraform/template/lambdas/cognito-triggers.ts
- confirm user could timeout when associating a brand new person.
- Potentially remove switch-cognito-triggers-color.js as we do not have cognito triggers. Also remove cognito triggers from terraform.

::: SOLO :::
- Update styling for forgotpassword, login, and resetpassword

::: QUESTIONS :::
- What happens if someone creates an account, we deploy 10007, and THEN they try to verify it?
- How do we make forgot password more secure? 
- Have we covered one of two scenarios mentioned in 10007 comments by Tenille?
- Swagger docs: Move to delete. Ask people to do so.

::: DOD :::
- Refactor cognito so every account has and can be looked up by custom:userId. Extract application.getCognito() into application.getUserGateway();
- Refactor getCognito to be more generic - "getAuthenticationGateway"
  - Abstract away from cognito specific syntax in interactors
- Remove createUserInteractor() and createOrUpdateUser(). Make bulkimportjudgeusrs do its own thing.

::: Deployment :::
- Environment specific deploy
?