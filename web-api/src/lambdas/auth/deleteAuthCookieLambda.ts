import { deleteCookieString } from '../../utilities/cookieFormatting';
import { genericHandler } from '../../genericHandler';

export const deleteAuthCookieLambda = event =>
  genericHandler(
    event,
    () => {
      return {
        body: '',
        headers: {
          'Set-Cookie': deleteCookieString(
            'refreshToken',
            process.env.EFCMS_DOMAIN,
            !process.env.IS_LOCAL,
          ),
        },
        statusCode: 204,
      };
    },
    {
      bypassMaintenanceCheck: true,
    },
  );
