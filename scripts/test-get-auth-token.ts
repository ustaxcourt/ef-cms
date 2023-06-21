import { createApplicationContext } from '../web-api/src/applicationContext';

(async () => {
  const applicationContext = createApplicationContext({});
  const result = await applicationContext
    .getCognito()
    .adminInitiateAuth({
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      AuthParameters: {
        PASSWORD: 'Q3pn$7ae',
        USERNAME: 'telliott+testauth@flexion.us',
      },
      ClientId: process.env.CLIENT_ID,
      UserPoolId: process.env.USER_POOL_ID,
    })
    .promise();
  console.log('ADMIN INITIATE AUTH RESPONSE ', result);
})();
