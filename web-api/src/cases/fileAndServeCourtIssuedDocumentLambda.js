const { genericHandler } = require('../genericHandler');

/**
 * File and serve court issued document
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.fileAndServeCourtIssuedDocumentLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .fileAndServeCourtIssuedDocumentInteractor({
        ...JSON.parse(event.body),
        applicationContext,
      });
  });
