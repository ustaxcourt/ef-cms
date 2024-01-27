::: STUFF TO DO :::
- confirm user could timeout when associating a brand new person.
- Potentially remove switch-cognito-triggers-color.js as we do not have cognito triggers. Also remove cognito triggers from terraform.

::: SOLO :::
- Update styling for forgotpassword, login, and resetpassword
 - Login: white box padding is incorrect (right and left not equal), "Login to Dawson" is using wrong font (should match header for create account).
  - NOTE: padding is technically equal on both sides, it's a visual distortion because text isn't extending the length of its container.
 - Forgot Password: white box padding is incorrect (right and left not equal), "Forgot.." is using wrong font (should match header for create account), extra "have" in bottom sentence.
 - Reset Password: too much padding in white box, Retype Password need margin-top, "Reset Password" is using wrong font (should match header for create account), should be fixed with padding however make sure hide/show password doesn't warp requirements text.
 - Labels are OK as "semi" bold. So don't worry about changing this to match mocks.
 - Alert text wrapping is OK.


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