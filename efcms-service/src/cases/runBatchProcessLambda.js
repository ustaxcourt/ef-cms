const {
  handle,
  getUserFromAuthHeader,
} = require('../middleware/apiGatewayHelper');
const createApplicationContext = require('../applicationContext');

/**
 * used for batching documents to send to IRS
 *
 * @param {Object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event => {
  return handle(event, () => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    return applicationContext.getUseCases().runBatchProcess({
      applicationContext,
    });
  });
};
