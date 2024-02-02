::: STUFF TO DO :::
- test cases
- Changing Email for Practitioner as admissions clerk for endpoint: /async/practitioners/:barNumber stalls out.
- When something goes into the dead letter queue, we should send out some sort of notification, to what and who is TBD. 
- Center login, create-petitioner, forgot-password in the blue area
- less white space on bottom of create-petitioner

::: SOLO :::
- Update Swagger docs (not able to delete)


::: QUESTIONS :::
- What happens if someone creates an account, we deploy 10007, and THEN they try to verify it?
- How do we make forgot password more secure? 
- Have we covered one of two scenarios mentioned in 10007 comments by Tenille?
- Retry logic around Worker Queues? They currently fan out for email changes, if it fails it will goto dead letter queue. Since verifyPendingEmail endpoint isn't async anymore it doesn't retry like it used. 

::: DOD :::
- Refactor cognito so every account has and can be looked up by custom:userId. Extract application.getCognito() into application.getUserGateway();
- Refactor getCognito to be more generic - "getAuthenticationGateway"
  - Abstract away from cognito specific syntax in interactors
- Remove createUserInteractor() and createOrUpdateUser(). Make bulkimportjudgeusrs do its own thing.
- Post-Deployment: Potentially remove switch-cognito-triggers-color.js as we do not have cognito triggers. Also remove cognito triggers from terraform.


::: Deployment :::
- Environment specific deploy
