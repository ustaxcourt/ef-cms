const { genericHandler } = require('../genericHandler');

/**
 * used for sending the case to the irs
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .sendPetitionToIRSHoldingQueueInteractor({
        applicationContext,
        caseId: event.pathParameters.caseId,
      });
  });
