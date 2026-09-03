import { createCookieString } from '@web-api/utilities/cookieFormatting';
import { genericHandler } from '../../genericHandler';
import { exchangeAuthCodeInteractor } from '@web-api/business/useCases/auth/exchangeAuthCodeInteractor';

export const exchangeAuthCodeLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      const { authCode } = JSON.parse(event.body);

      const { accessToken, idToken, refreshToken, expiresAt } =
        await exchangeAuthCodeInteractor(applicationContext, {
          authCode,
        });

      return {
        body: { accessToken, idToken, refreshToken },
        headers: {
          'Set-Cookie': createCookieString(
            'refreshToken',
            refreshToken,
            expiresAt,
            process.env.EFCMS_DOMAIN,
            applicationContext.environment.stage !== 'local',
          ),
        },
        statusCode: 200,
      };
    },
    { bypassMaintenanceCheck: true },
  );
