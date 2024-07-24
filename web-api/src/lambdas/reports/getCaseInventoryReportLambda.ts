import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getCaseInventoryReportInteractor } from '@web-api/business/useCases/caseInventoryReport/getCaseInventoryReportInteractor';

/**
 * used for fetching the case inventory report data
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getCaseInventoryReportLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await getCaseInventoryReportInteractor(
      applicationContext,
      {
        ...event.queryStringParameters,
      },
      authorizedUser,
    );
  });
