import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';

export const exchangeAuthCodeInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    authCode,
    code_verifier,
    isTestUser,
  }: { authCode: string; code_verifier: string; isTestUser: boolean },
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
    params.append('code_verifier', code_verifier);
    if (isTestUser) {
      params.append(
        'redirect_uri',
        `https://app-${process.env.CURRENT_COLOR}.${process.env.EFCMS_DOMAIN}/auth-code`,
      );
    } else {
      params.append(
        'redirect_uri',
        `https://app.${process.env.EFCMS_DOMAIN}/auth-code`,
      );
    }

    const response = await applicationContext
      .getHttpClient()
      .post(`${process.env.MANAGED_LOGIN_DOMAIN}/oauth2/token`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

    const expiresAt = applicationContext.getUtilities().calculateISODate({
      dateString: applicationContext.getUtilities().createISODateString(),
      howMuch: 1,
      units: 'days',
    });

    return {
      accessToken: response.data.access_token,
      idToken: response.data.id_token,
      refreshToken: response.data.refresh_token,
      expiresAt,
    };
  } catch (err: any) {
    if (err?.response?.status === 403) {
      throw new UnauthorizedError('Code exchange failed: Unauthorized');
    }

    throw err;
  }
};
