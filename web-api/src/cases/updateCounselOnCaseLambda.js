const { genericHandler } = require('../genericHandler');

/**
 * used for updating a practitioner or respondent on a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .updateCounselOnCaseInteractor({
        applicationContext,
        caseId: event.pathParameters.caseId,
        userData: JSON.parse(event.body),
        userIdToUpdate: event.pathParameters.userId,
      });
  });
