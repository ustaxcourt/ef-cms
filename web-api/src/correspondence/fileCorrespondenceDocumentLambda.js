const { genericHandler } = require('../genericHandler');

/**
 * adds a correspondence document to the case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.fileCorrespondenceDocumentLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .fileCorrespondenceDocumentInteractor({
        ...JSON.parse(event.body),
        applicationContext,
      });
  });
