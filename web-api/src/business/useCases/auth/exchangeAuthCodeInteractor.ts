import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';

export const exchangeAuthCodeInteractor = async (
  applicationContext: ServerApplicationContext,
  { authCode }: { authCode: string },
): Promise<any> => {
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

    return response.data;
  } catch (err: any) {
    if (err.name === 'NotAuthorizedException') {
      throw new UnauthorizedError('Invalid refresh token');
    }

    throw err;
  }
};
