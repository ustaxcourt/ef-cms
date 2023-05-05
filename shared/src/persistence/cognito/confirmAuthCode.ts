import { getClientId } from './getClientId';

export const confirmAuthCode = async ({ applicationContext, code }) => {
  const { COGNITO_SUFFIX, EFCMS_DOMAIN, STAGE } = process.env;

  const clientId = await getClientId({ userPoolId: process.env.USER_POOL_ID });

  const response = await applicationContext.getHttpClient().post(
    `https://auth-${STAGE}-${COGNITO_SUFFIX}.auth.us-east-1.amazoncognito.com/oauth2/token`,
    new URLSearchParams({
      client_id: clientId,
      code,
      grant_type: 'authorization_code',
      redirect_uri: `https://app.${EFCMS_DOMAIN}/log-in`,
    }),
  );

  return {
    refreshToken: response.data.refresh_token,
    token: response.data.id_token,
  };
};
