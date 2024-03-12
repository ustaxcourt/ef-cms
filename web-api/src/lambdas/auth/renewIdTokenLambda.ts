import { UnauthorizedError } from '@web-api/errors/errors';
import { genericHandler } from '../../genericHandler';
import { parseCookieString } from '../../utilities/cookieFormatting';

export const renewIdTokenLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      if (!event.headers.cookie) {
        throw new UnauthorizedError('refreshToken is required');
      }

      const { refreshToken } = parseCookieString(event.headers.cookie);

      return applicationContext
        .getUseCases()
        .renewIdTokenInteractor(applicationContext, {
          refreshToken,
        });
    },
    { bypassMaintenanceCheck: true },
  );
