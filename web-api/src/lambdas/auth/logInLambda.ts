import { createCookieString } from '../../utilities/cookieFormatting';
import { genericHandler } from '../../genericHandler';

export const logInLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      const { accessToken, refreshToken } = await applicationContext
        .getUseCases()
        .logInInteractor(applicationContext, { ...JSON.parse(event.body) });

      const expiresAt = applicationContext.getUtilities().calculateISODate({
        dateString: applicationContext.getUtilities().createISODateString(),
        howMuch: 29,
        units: 'days',
      });

      return {
        body: { accessToken },
        headers: {
          'Set-Cookie': createCookieString(
            'refreshToken',
            refreshToken,
            expiresAt,
            process.env.EFCMS_DOMAIN,
            !process.env.IS_LOCAL,
          ),
        },
        statusCode: 200,
      };
    },
    {
      bypassMaintenanceCheck: true,
    },
  );
