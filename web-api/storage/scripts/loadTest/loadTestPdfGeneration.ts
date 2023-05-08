const AWS = require('aws-sdk');
const axios = require('axios');
const { getUserToken } = require('./loadTestHelpers');

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: process.env.REGION,
});

(async () => {
  const token = await getUserToken({
    cognito,
    env: process.env.ENV,
    password: process.env.DEFAULT_ACCOUNT_PASS,
    username: 'petitionsclerk1@example.com',
  });

  console.log(process.env.ENV);
  console.log(process.env.DEFAULT_ACCOUNT_PASS);
  console.log(process.env.SIZE);
  console.log(process.env.DEPLOYING_COLOR);
  console.log(process.env.EFCMS_DOMAIN);

  console.log({ token });

  for (let i = 0; i < 100; i++) {
    try {
      const response = await axios.get(
        `https://api-${process.env.DEPLOYING_COLOR}.${process.env.EFCMS_DOMAIN}/reports/printable-case-inventory-report?associatedJudge=Ashford&status=Assigned+-+Case`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response);
    } catch (e) {
      console.log('ERROR', e);
      throw e;
    }
  }
})();
