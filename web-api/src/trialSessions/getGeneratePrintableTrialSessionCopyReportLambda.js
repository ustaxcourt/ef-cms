const { genericHandler } = require('../genericHandler');

/**
 * generate the printable trial session working copy and return url
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getGeneratePrintableTrialSessionCopyReportLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .generatePrintableTrialSessionCopyReportInteractor(applicationContext, {
          formattedTrialSession: JSON.parse(event.body),
        });
    },
    // { logResults: false },
  );
