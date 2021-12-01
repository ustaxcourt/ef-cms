const qs = require('querystring');

exports.refreshToken = async (applicationContext, { refreshToken }) => {
  const STAGE = 'exp3'; //process.env.STAGE // TODO: should not be hard coded
  const COGNITO_SUFFIX = 'flexion-efcms'; //process.env.COGNITO_SUFFIX // TODO: should not be hard coded
  // const EFCMS_DOMAIN = 'exp3.ustc-case-mgmt.flexion.us'; //process.env.EFCMS_DOMAIN // TODO: should not be hard coded

  const response = await applicationContext.getHttpClient()({
    data: qs.stringify({
      client_id: '3pt563plfbm7k4do29u4n13tel', // TODO: should not be hard coded
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    method: 'POST',
    url: `https://auth-${STAGE}-${COGNITO_SUFFIX}.auth.us-east-1.amazoncognito.com/oauth2/token`,
  });

  return {
    idToken: response.data.id_token,
  };
};
