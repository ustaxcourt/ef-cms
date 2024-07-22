import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { generatePrintablePendingReportInteractor } from '@web-api/business/useCases/pendingItems/generatePrintablePendingReportInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * generate the printable pending report and return url
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const generatePrintablePendingReportLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await generatePrintablePendingReportInteractor(
        applicationContext,
        {
          ...event.queryStringParameters,
        },
        authorizedUser,
      );
    },
    { logResults: false },
  );
