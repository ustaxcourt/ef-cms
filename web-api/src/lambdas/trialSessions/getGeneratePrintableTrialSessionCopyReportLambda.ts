import { genericHandler } from '../../genericHandler';

/**
 * generate the printable trial session working copy and return url
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getGeneratePrintableTrialSessionCopyReportLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const body = JSON.parse(event.body);
    return await applicationContext
      .getUseCases()
      .generatePrintableTrialSessionCopyReportInteractor(applicationContext, {
        filters: body.filters,
        formattedCases: body.formattedCases,
        formattedTrialSession: body.formattedTrialSession,
        sessionNotes: body.sessionNotes,
        showCaseNotes: body.showCaseNotes,
        sort: body.sort,
        userHeading: body.userHeading,
      });
  });
