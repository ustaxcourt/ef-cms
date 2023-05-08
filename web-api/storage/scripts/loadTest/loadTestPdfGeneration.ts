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

  for (let i = 0; i < 400; i++) {
    try {
      const response = await axios.post(
        `https://api-${process.env.DEPLOYING_COLOR}.${$process.env.EFCMS_DOMAIN}/reports/case-inventory-report`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response);
    } catch (e) {
      console.log('ERROR', e);
    }
  }
})();
