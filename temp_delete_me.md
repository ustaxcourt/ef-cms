::: STUFF TO DO :::
- test cases (review ones Tenille wrote on story)
- Test dlq (alarm and sns topic work)
- Smoketests: we haven't run them in a long time
- Let Tenille know that we've covered scenario two in 10007 comments


::: SOLO :::
- send styling back to UX for second check on exp2?
- Investigate socket closure (outage, idle state, etc)


::: QUESTIONS :::
- What happens if someone creates an account, we deploy 10007, and THEN they try to verify it?
- Retry logic around Worker Queues? They currently fan out for email changes, if it fails it will go to dead letter queue. Since verifyPendingEmail endpoint isn't async anymore it doesn't retry like it used. 

::: DOD :::
- Refactor cognito so every account has and can be looked up by custom:userId. Extract application.getCognito() into application.getUserGateway();
- Refactor getCognito to be more generic - "getAuthenticationGateway"
  - Abstract away from cognito specific syntax in interactors
- Remove createUserInteractor() and createOrUpdateUser(). Make bulkimportjudgeusrs do its own thing.
- Post-Deployment: Potentially remove switch-cognito-triggers-color.js as we do not have cognito triggers. Also remove cognito triggers from terraform.


::: Deployment :::
- Environment specific deploy
- Account specific deploy(sns_topic in west)
 