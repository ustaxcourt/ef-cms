const createApplicationContext = require('../applicationContext');
const { handle } = require('../middleware/apiGatewayHelper');

/**
 * lambda which is used for checking for ready for trial cases.
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  handle(event, async () => {
    const applicationContext = createApplicationContext({});
    try {
      const results = await applicationContext
        .getUseCases()
        .checkForReadyForTrialCasesInteractor({
          applicationContext,
        });
      applicationContext.logger.info('Results', results);
      return results;
    } catch (e) {
      applicationContext.logger.error(e);
      throw e;
    }
  });
