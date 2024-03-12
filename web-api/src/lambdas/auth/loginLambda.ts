import { createCookieString } from '../../utilities/cookieFormatting';
import { genericHandler } from '../../genericHandler';

export const loginLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      const { accessToken, idToken, refreshToken } = await applicationContext
        .getUseCases()
        .loginInteractor(applicationContext, { ...JSON.parse(event.body) });

      const expiresAt = applicationContext.getUtilities().calculateISODate({
        dateString: applicationContext.getUtilities().createISODateString(),
        howMuch: 1,
        units: 'days',
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
    {
      bypassMaintenanceCheck: true,
    },
  );
