import { deleteCookieString } from '../../utilities/cookieFormatting';
import { genericHandler } from '../../genericHandler';

/**
 * Clears the refresh token from the cookie
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
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
