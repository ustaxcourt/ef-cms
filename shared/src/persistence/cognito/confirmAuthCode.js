const qs = require('querystring');
const { getClientId } = require('./getClientId');

exports.confirmAuthCode = async (applicationContext, { code }) => {
  const { STAGE } = process.env;
  const { COGNITO_SUFFIX } = process.env;
  const { EFCMS_DOMAIN } = process.env;

  const clientId = await getClientId({ userPoolId: process.env.USER_POOL_ID });

  const response = await applicationContext.getHttpClient()({
    data: qs.stringify({
      client_id: clientId,
      code,
      grant_type: 'authorization_code',
      redirect_uri: `https://app.${EFCMS_DOMAIN}/log-in`,
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    method: 'POST',
    url: `https://auth-${STAGE}-${COGNITO_SUFFIX}.auth.us-east-1.amazoncognito.com/oauth2/token`,
  });

  return {
    refreshToken: response.data.refresh_token,
    token: response.data.id_token,
  };
};
