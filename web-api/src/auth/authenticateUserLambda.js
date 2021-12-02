const { DateTime } = require('luxon');
const { genericHandler } = require('../genericHandler');

/**
 * Sets the authentication cookie based on the OAuth code
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.authenticateUserLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { refreshToken, token } = await applicationContext
      .getUseCases()
      .authenticateUserInteractor(applicationContext, JSON.parse(event.body));
    const expiresAtIso = applicationContext.getUtilities().calculateISODate({
      dateString: applicationContext.getUtilities().createISODateString(),
      howMuch: 29,
      units: 'days',
    });
    // TODO: is this correct?  should we have the zone set to new york?
    const expiresAtUtc = DateTime.fromISO(expiresAtIso, {
      zone: 'America/New_York',
    }).toUTC();
    return {
      body: JSON.stringify({ token }),
      headers: {
        'Set-Cookie': `refreshToken=${refreshToken}; Expires=${expiresAtUtc}; Secure; HttpOnly; Domain=${process.env.EFCMS_DOMAIN}`,
      },
      statusCode: 200,
    };
  });
