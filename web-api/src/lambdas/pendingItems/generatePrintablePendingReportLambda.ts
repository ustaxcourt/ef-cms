import { genericHandler } from '../../genericHandler';

/**
 * generate the printable pending report and return url
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const generatePrintablePendingReportLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .generatePrintablePendingReportInteractor(applicationContext, {
          ...event.queryStringParameters,
        });
    },
    { logResults: false },
  );
