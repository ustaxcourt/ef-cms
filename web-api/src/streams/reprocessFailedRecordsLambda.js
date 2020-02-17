const createApplicationContext = require('../applicationContext');
const { handle } = require('../middleware/apiGatewayHelper');

/**
 * used for processing failed stream records
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
        .reprocessFailedRecordsInteractor({
          applicationContext,
        });
      applicationContext.logger.info('Results', results);
    } catch (e) {
      applicationContext.logger.error(e);
      throw e;
    }
  });
