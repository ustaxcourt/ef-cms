import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { fetchPendingItemsInteractor } from '@web-api/business/useCases/pendingItems/fetchPendingItemsInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * used for fetching pending items
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const fetchPendingItemsLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await fetchPendingItemsInteractor(
      applicationContext,
      {
        ...event.queryStringParameters,
      },
      authorizedUser,
    );
  });
