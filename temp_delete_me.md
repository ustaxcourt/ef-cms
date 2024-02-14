::: STUFF TO DO :::
- Run full experimental deploy (NOT on exp1, exp2, or exp3). -> All
  - Remove switch colors step. Test that the old cognito workflow + account creation are still functional.
  - Switch colors and verify login + account creation are functional.
- Potentially remove websocket messaging from update web-api/src/business/useCases/user/updateAssociatedCaseWorker.ts.
- automate maintenance mode in circle prod deploy
- during deploy, turn off login and sign up


::: SOLO :::


::: QUESTIONS :::
- What happens if someone creates an account, we deploy 10007, and THEN they try to verify it?
- Retry logic around Worker Queues? They currently fan out for email changes, if it fails it will go to dead letter queue. Since verifyPendingEmail endpoint isn't async anymore it doesn't retry like it used.

::: New Patterns To Describe :::
- Worker Queue + Gateway
- Login local vs deployed
- Cypress running in deployed environments
- InitAppSequence
- No more cognito triggers