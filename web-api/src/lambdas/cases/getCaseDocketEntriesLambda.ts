import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getCaseDocketEntriesInteractor } from '@shared/business/useCases/getCaseDocketEntriesInteractor';

/**
 * used for fetching paginated docket entries for a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getCaseDocketEntriesLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, () =>
    getCaseDocketEntriesInteractor(
      {
        docketNumber: event.pathParameters.docketNumber,
        page: parseInt(event.queryStringParameters?.page ?? '0', 10),
      },
      authorizedUser,
    ),
  );
