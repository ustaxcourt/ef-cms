::: STUFF TO DO :::
- test cases
  - update broken tests with worker queue
- Change password interactor - Update user record before logging user in (INSTEAD OF part of worker queue).
- Change password interactor - refresh token is not set as a cookie

::: SOLO :::
- Update Swagger docs (not able to delete)


::: QUESTIONS :::
- What happens if someone creates an account, we deploy 10007, and THEN they try to verify it?
- How do we make forgot password more secure? 
- Have we covered one of two scenarios mentioned in 10007 comments by Tenille?


::: DOD :::
- Refactor cognito so every account has and can be looked up by custom:userId. Extract application.getCognito() into application.getUserGateway();
- Refactor getCognito to be more generic - "getAuthenticationGateway"
  - Abstract away from cognito specific syntax in interactors
- Remove createUserInteractor() and createOrUpdateUser(). Make bulkimportjudgeusrs do its own thing.
- Post-Deployment: Potentially remove switch-cognito-triggers-color.js as we do not have cognito triggers. Also remove cognito triggers from terraform.


::: Deployment :::
- Environment specific deploy
