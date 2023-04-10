const { genericHandler } = require('../genericHandler');

/**
 * used for validating PDF documents
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.validatePdfLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { key } = event.pathParameters || {};

    return await applicationContext
      .getUseCases()
      .validatePdfInteractor(applicationContext, {
        key,
      });
  });
