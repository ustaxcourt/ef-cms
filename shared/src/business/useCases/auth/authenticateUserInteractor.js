const qs = require('querystring');
const { default: axios } = require('axios');

exports.authenticateUserInteractor = async (applicationContext, { code }) => {
  const STAGE = 'exp3'; //process.env.STAGE
  const COGNITO_SUFFIX = 'flexion-efcms'; //process.env.COGNITO_SUFFIX
  // const EFCMS_DOMAIN = 'exp3.ustc-case-mgmt.flexion.us'; //process.env.EFCMS_DOMAIN

  const response = await axios({
    data: qs.stringify({
      client_id: '3pt563plfbm7k4do29u4n13tel',
      code,
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:1234/log-in',
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    method: 'POST',
    url: `https://auth-${STAGE}-${COGNITO_SUFFIX}.auth.us-east-1.amazoncognito.com/oauth2/token`,
  });

  return {
    idToken: response.data.id_token,
    refreshToken: response.data.refresh_token,
  };
};
