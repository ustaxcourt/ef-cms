

## Manual End of Sprint QA
At the end of a sprint PR, we'd like to run manual smoke tests over our system in an attempt to reduce bugs sent to the court's system.  The following manual tests can be ran by following the steps provided:

#### Verify Cognito Registration
- go to the cognito UI
- create a new user with your email, i.e. cseibert+petitioner1@flexion.us
- verify you received a verify email
- login to your petitioner account

#### Verify Email Notifications
- If you already have a petitioner account, login and create a case
- keep track of that docket number
- login as a petitions clerk
- upload a pdf to the case created by your petitioner
- sign the pdf
- add a docket entry
- serve
- verify the petitioner got an email notificaton

#### Verify Web Sockets - Batch Download Case as Judge

- If you already created that case above, you should be able to just add it to a trial session
- login as a docketclerk
- navigate to case created above, or a case with an electronic service party
- manually add the case to a trial session
- this should make a request to the websocket endpoint
- if web sockets fail, you will see it in the console
