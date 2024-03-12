```
UI (Petitioner)->API: update email
API->Dynamo: set pending email & token on user
API->SES: send email to petitioner with token
SES->Petitioner: email sent
note over Petitioner: click verify link in email
Petitioner->UI (Petitioner): verify-email?token route
UI (Petitioner)->API: call /users/verify-email
note over UI (Petitioner): success! ask user to login
API->Dynamo: update email / clear pending email
note over API: for each case attached to user
note over API: generate a NOCE if needed
API->S3: save NOCE pdf
note over API: create work item if needed
API->Dynamo: persist work items, update case info, etc
UI (Petitioner)->Cognito: redirect to cognito
Cognito->UI (Petitioner): login with new email address
```

![Flow](petitioner-updates-own-email.png)