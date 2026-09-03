import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';

export const exchangeAuthCodeInteractor = async (
  applicationContext: ServerApplicationContext,
  { authCode }: { authCode: string },
): Promise<{
  accessToken: string;
  idToken: string;
  refreshToken: string;
  expiresAt: string;
}> => {
  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', process.env.COGNITO_CLIENT_ID || '');
    params.append('code', authCode);
    params.append(
      'redirect_uri',
      `https://app.${process.env.EFCMS_DOMAIN}/auth-code`,
    );

    const response = await applicationContext
      .getHttpClient()
      .post(`${process.env.MANAGED_LOGIN_DOMAIN}/oauth2/token`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

    return {
      accessToken: response.data.access_token,
      idToken: response.data.id_token,
      refreshToken: response.data.refresh_token,
      expiresAt: response.data.expires_in,
    };
  } catch (err: any) {
    if (err.name === 'NotAuthorizedException') {
      throw new UnauthorizedError('Invalid refresh token');
    }

    throw err;
  }
};
