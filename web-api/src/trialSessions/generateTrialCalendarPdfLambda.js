const createApplicationContext = require('../applicationContext');
const { customHandle } = require('../customHandle');
const { getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');

/**
 * lambda for creating the printable trial calendar
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */

exports.handler = event =>
  customHandle(event, async () => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    const { trialSessionId } = JSON.parse(event.body);

    try {
      const result = await applicationContext
        .getUseCases()
        .generateTrialCalendarPdfInteractor({
          applicationContext,
          trialSessionId,
        });
      applicationContext.logger.info('User', user);
      return result;
    } catch (e) {
      applicationContext.logger.error(e);
      throw e;
    }
  });
