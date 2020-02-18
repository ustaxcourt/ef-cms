const createApplicationContext = require('../applicationContext');
const { customHandle } = require('../customHandle');
const { getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');

/**
 * used for generating / setting notices of trial on cases set for the given trial session
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  customHandle(event, async () => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    try {
      const { caseId } = JSON.parse(event.body);

      const results = await applicationContext
        .getUseCases()
        .setNoticesForCalendaredTrialSessionInteractor({
          applicationContext,
          caseId: caseId,
          trialSessionId: event.pathParameters.trialSessionId,
        });
      applicationContext.logger.info('User', user);
      return results;
    } catch (e) {
      applicationContext.logger.error(e);
      throw e;
    }
  });
