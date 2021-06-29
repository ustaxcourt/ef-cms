# Petitioner Access

## Admissions Clerk adds email to petitioner on a case
* If a petitioner has no email on a case, their service preference options are Paper and None
* Once an email has been added and verified, the service preference updates to Electronic

### Email has matching Cognito account
If Admissions Clerk enters an email that already exists in Cognito, on save:
* Case is added to Petitioner Dashboard
* Service indicator is updated to electronic
* Email receives service emails


### Email has no matching Cognito account
If Admissions Clerk enters an email that does not exist in Cognito, on save:
* Email receives welcome email from Cognito
* Service remains paper until petitioner has logged in using email

#### Petitioner verifies new email
Once petitioner logs into system with their temporary password and updates their password:
* Case is added to Petitioner Dashboard
* Service indicator is updated to electronic
* Email receives service emails
