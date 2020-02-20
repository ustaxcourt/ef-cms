const { genericHandler } = require('../genericHandler');

/**
 * used for recalling the case from the irs holding queue
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .recallPetitionFromIRSHoldingQueueInteractor({
        applicationContext,
        caseId: event.pathParameters.caseId,
      });
  });
