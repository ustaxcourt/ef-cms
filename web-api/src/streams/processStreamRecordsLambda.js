const createApplicationContext = require('../applicationContext');
const { handle } = require('../middleware/apiGatewayHelper');

/**
 * used for processing stream records from persistence
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  handle(event, async () => {
    const applicationContext = createApplicationContext({});
    try {
      const recordsToProcess = event.Records;
      const results = await applicationContext
        .getUseCases()
        .processStreamRecordsInteractor({
          applicationContext,
          recordsToProcess,
        });
      applicationContext.logger.info('Results', results);
      return results;
    } catch (e) {
      applicationContext.logger.error(e);
      throw e;
    }
  });
