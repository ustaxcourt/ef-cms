::: STUFF TO DO :::
- Create Presentation on new patterns
- For account confirmation set "U.S. Tax Court" as the respondant
- create petitioner padding on mobile should match login
- add pa11y to login and change password
- refactor cypressEnv to handle node vs window environment.


::: QUESTIONS :::
- Ask how many users are in an unconfirmed state in prod. If there are many we may need to think more about how to direct users.
    - There 1388 Unconfirmed accounts.


::: New Patterns To Describe :::
- Worker Queue + Gateway
- Login local vs deployed
- Cypress running in deployed environments
- InitAppSequence
- No more cognito triggers


::: Things to Test :::
- Login
- Court Employee Login
  - Zendesk Automations (ex - new employee, remove employee, Add to Closed for legacy)
- Idle Logout
- Maintenance Mode
- E-Access for Practitioner
- E-Access for Practitioner (Code Expired - Cognito issued code, expire time is 7 days and has not changed)
- E-Access for Petitioner
- E-Access for Petitioner (Code Expired - Cognito issued code, expire is 7 days and has not changed)
- Pending Email for Practitioner
- Pending Email for Petitioner
- Forgot Password
- Forgot Password (Code Expired - can be expired manually, ask devs)
- Create Petitioner Account
- Create Petitioner Account Verification
- Create Petitioner Account Verification (Code Expired - can be expired manually, ask devs)
- Async operations that use websockets


::: Post Deployment Things to Know :::
- Create Petitioner Account verification email link sent before 10007 deploy will no longer work
    - Remediation steps: Ask the user to attempt to login to DAWSON. They will be sent a new verification email with a new link they can use to verify their account. 
- Verify pending email
    - Old email will work successfully without the user needing to do anything. User still needs to be logged in when they click on the verify link.
- Forgot password
    - Old email doesn't do anything and the temporary code isn't used anywhere. 
    - The user's account is in clean state, they can login assuming they know their password, or they can go through the new forgot password process.
- Temporary password given after e-access
    - Old email continues to work and has correct instructions.
    - User is able to successfully set a new password and login.




















