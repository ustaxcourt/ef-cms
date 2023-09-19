import { genericHandler } from '../../genericHandler';
import { parseCookieString } from '../../utilities/cookieFormatting';

export const refreshAuthTokenLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      if (!event.headers.cookie) {
        throw new Error('Cookie header is missing');
      }

      const { refreshToken } = parseCookieString(event.headers.cookie);
      const { token } = await applicationContext
        .getUseCases()
        .refreshAuthTokenInteractor(applicationContext, {
          refreshToken,
        });
      return {
        token,
      };
    },
    { bypassMaintenanceCheck: true },
  );
