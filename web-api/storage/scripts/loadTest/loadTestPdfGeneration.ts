const AWS = require('aws-sdk');
const axios = require('axios');
const { getUserToken } = require('./loadTestHelpers');

(async () => {
  const cognito = new AWS.CognitoIdentityServiceProvider({
    region: 'us-east-1',
  });

  const token = await getUserToken({
    cognito,
    env: process.env.ENV,
    password: process.env.DEFAULT_ACCOUNT_PASS,
    username: 'petitionsclerk1@example.com',
  });

  for (let i = 0; i < 100; i++) {
    try {
      await axios.get(
        `https://api-${process.env.DEPLOYING_COLOR}.${process.env.EFCMS_DOMAIN}/reports/printable-case-inventory-report?associatedJudge=&status=New`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (e) {
      console.log('ERROR', e);
      throw e;
    }
  }
})();
