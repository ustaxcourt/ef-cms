const createApplicationContext = require('../applicationContext');

/**
 * used for processing stream records from persistence
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.processStreamRecordsLambda = async event => {
  const applicationContext = createApplicationContext({});
  applicationContext.logger.debug('received a stream event of', event);
  const recordsToProcess = event.Records;
  return await applicationContext.getUseCases().processStreamRecordsInteractor({
    applicationContext,
    recordsToProcess,
  });
};
