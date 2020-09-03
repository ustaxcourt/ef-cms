const { genericHandler } = require('../genericHandler');

/**
 * used for sealing an address on a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.sealCaseContactAddressLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .sealCaseContactAddressInteractor({
        applicationContext,
        ...event.pathParameters,
      });
  });
