const { genericHandler } = require('../genericHandler');

/**
 * lambda for creating the printable trial calendar
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.generateTrialCalendarPdfLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      const { trialSessionId } = JSON.parse(event.body);

      return await applicationContext
        .getUseCases()
        .generateTrialCalendarPdfInteractor({
          applicationContext,
          trialSessionId,
        });
    },
    { logResults: false },
  );
