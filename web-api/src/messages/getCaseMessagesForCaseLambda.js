const { genericHandler } = require('../genericHandler');

/**
 * lambda which is used for retrieving case messages for a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getCaseMessagesForCaseLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getCaseMessagesForCaseInteractor({
        applicationContext,
        caseId: event.pathParameters.caseId,
      });
  });
