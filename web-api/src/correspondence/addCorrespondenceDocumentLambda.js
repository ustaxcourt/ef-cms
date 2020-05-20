const { genericHandler } = require('../genericHandler');

/**
 * upload a correspondence document
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.addCorrespondenceDocumentLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext.getUseCases().uploadCorrespondenceDocument({
      ...JSON.parse(event.body),
      applicationContext,
    });
  });
