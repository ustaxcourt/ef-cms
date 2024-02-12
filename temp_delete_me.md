::: STUFF TO DO :::
- Test cases (review ones Tenille wrote on story)
- Move 10007 cypress tests so that run on deployed and local environments
- Run full experimental deploy (NOT on exp1, exp2, or exp3).
  - Remove switch colors step. Test that the old cognito workflow + account creation are still functional.
  - Switch colors and verify login + account creation are functional.


::: SOLO :::
- Investigate socket closure (outage, idle state, etc)
- Convert to Encoded Query Strings for reset and forgot password like with Confirm Signup?


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
- New lambda function being deployed - this will require manual deploy steps
  - First deploy will fail, need to copy worker_<DEPLOYING_COLOR>.js.zip and upload a copy as worker_<CURRENT_COLOR>.js.zip


::: New Patterns To Describe :::
- Worker Queue + Gateway
- Login local vs deployed
- Cypress running in deployed environments
- InitAppSequence
- No more cognito triggers