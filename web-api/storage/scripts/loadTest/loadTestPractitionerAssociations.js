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
    const docketNumber = 310 + i;
    try {
      const response = await axios.post(
        `https://api-blue.dawson.flexion.us/case-parties/${docketNumber}-20/associate-private-practitioner`,
        {
          docketNumber: `${docketNumber}-20`,
          representingPrimary: true,
          representingSecondary: false,
          serviceIndicator: 'Electronic',
          userId: '56560b2a-d612-4283-b578-256d311b974a',
        },
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
