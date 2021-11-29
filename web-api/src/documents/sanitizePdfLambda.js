const { genericHandler } = require('../genericHandler');

/**
 * used for sanitizing PDF documents
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.sanitizePdfLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { key } = event.pathParameters || {};

    return await applicationContext
      .getUseCases()
      .sanitizePdfInteractor(applicationContext, {
        key,
      });
  });
