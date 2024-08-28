import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { generatePrintableCaseInventoryReportInteractor } from '@web-api/business/useCases/caseInventoryReport/generatePrintableCaseInventoryReportInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * generate the printable case inventory report
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const generatePrintableCaseInventoryReportLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await generatePrintableCaseInventoryReportInteractor(
        applicationContext,
        {
          ...event.queryStringParameters,
        },
        authorizedUser,
      );
    },
    { logResults: false },
  );
