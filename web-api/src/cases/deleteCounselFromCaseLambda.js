const { genericHandler } = require('../genericHandler');

/**
 * used for deleting a practitioner or respondent from a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .deleteCounselFromCaseInteractor({
        applicationContext,
        caseId: event.pathParameters.caseId,
        userIdToDelete: event.pathParameters.userId,
      });
  });
