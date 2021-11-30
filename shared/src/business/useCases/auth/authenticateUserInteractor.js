const qs = require('querystring');
const { default: axios } = require('axios');

exports.authenticateUserInteractor = async (applicationContext, { code }) => {
  const STAGE = 'exp3'; //process.env.STAGE
  const COGNITO_SUFFIX = 'flexion-efcms'; //process.env.COGNITO_SUFFIX
  // const EFCMS_DOMAIN = 'exp3.ustc-case-mgmt.flexion.us'; //process.env.EFCMS_DOMAIN

  const data = {
    client_id: '3pt563plfbm7k4do29u4n13tel',
    code,
    grant_type: 'authorization_code',
    redirect_uri: 'http://localhost:1234/log-in',
  };
  const options = {
    data: qs.stringify(data),
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    method: 'POST',
    url: `https://auth-${STAGE}-${COGNITO_SUFFIX}.auth.us-east-1.amazoncognito.com/oauth2/token`,
  };
  const response = await axios(options);

  console.log('response', JSON.stringify(response));

  return {
    idToken: '',
    refreshToken: '',
    ...response,
  };
};
