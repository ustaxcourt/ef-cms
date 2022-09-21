const { genericHandler } = require('../genericHandler');

/**
 * generate the printable trial session working copy and return url
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getGeneratePrintableTrialSessionCopyReportLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const body = JSON.parse(event.body);
    return await applicationContext
      .getUseCases()
      .generatePrintableTrialSessionCopyReportInteractor(applicationContext, {
        caseNotesFlag: body.caseNotesFlag,
        filters: body.filters,
        formattedCases: body.formattedCases,
        formattedTrialSession: body.formattedTrialSession,
        sessionNotes: body.sessionNotes,
      });
  });
