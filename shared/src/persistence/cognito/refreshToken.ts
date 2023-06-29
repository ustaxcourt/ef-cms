import { getClientId } from './getClientId';

// eslint-disable-next-line no-shadow
export const refreshToken = async (applicationContext, { refreshToken }) => {
  const { COGNITO_SUFFIX, STAGE } = process.env;

  const clientId = await getClientId({ userPoolId: process.env.USER_POOL_ID });

  const response = await applicationContext.getHttpClient().post(
    `https://auth-${STAGE}-${COGNITO_SUFFIX}.auth.us-east-1.amazoncognito.com/oauth2/token`,
    new URLSearchParams({
      client_id: clientId,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  );

  return {
    token: response.data.id_token,
  };
};
