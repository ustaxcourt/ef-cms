const qs = require('querystring');
const { getClientId } = require('./getClientId');

exports.refreshToken = async (applicationContext, { refreshToken }) => {
  const { STAGE } = process.env;
  const { COGNITO_SUFFIX } = process.env;

  const clientId = await getClientId({ userPoolId: process.env.USER_POOL_ID });

  // TODO: use URLSearchParams instead
  const response = await applicationContext.getHttpClient()({
    data: qs.stringify({
      client_id: clientId,
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
    token: response.data.id_token,
  };
};
