const createApplicationContext = require('../applicationContext');
const { customHandle } = require('../customHandle');
const { getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');

/**
 * run the trial session planning report
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  customHandle(event, async () => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    try {
      const results = await applicationContext
        .getUseCases()
        .runTrialSessionPlanningReportInteractor({
          applicationContext,
          ...JSON.parse(event.body),
        });
      applicationContext.logger.info('User', user);
      return results;
    } catch (e) {
      applicationContext.logger.error(e);
      throw e;
    }
  });
