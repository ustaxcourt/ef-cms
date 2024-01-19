::: STUFF TO DO :::
- Finish all todos
- Fix tests
  - web-api/terraform/template/lambdas/cognito-triggers.ts
  - cypress/cypress-integration/integration/maintenance.cy.ts
+ Extract error message strings into constants OR do something else. (On hold)
+ Forgot password flow.
- Figure out how to avoid lack of spinner when redirecting to login from public site

::: QUESTIONS :::
- What happens if someone creates an account, we deploy 10007, and THEN they try to verify it?
- Manual code generation/checking vs Cognito-based codes for forgot password flow

::: DOD :::
- Refactor cognito so every account has and can be looked up by custom:userId. Extract application.getCognito() into application.getUserGateway();
