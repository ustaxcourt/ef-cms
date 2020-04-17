const { genericHandler } = require('../genericHandler');

/**
 * run the trial session planning report
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.runTrialSessionPlanningReportLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .runTrialSessionPlanningReportInteractor({
          applicationContext,
          ...JSON.parse(event.body),
        });
    },
    { logResults: false },
  );
