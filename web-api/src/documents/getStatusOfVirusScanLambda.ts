const { genericHandler } = require('../genericHandler');

/**
 * used to get the status of the virus scan for a document
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getStatusOfVirusScanLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getStatusOfVirusScanInteractor(applicationContext, {
        key: event.pathParameters.key,
      });
  });
