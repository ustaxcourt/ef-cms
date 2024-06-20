import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { orderAdvancedSearchInteractor } from '@shared/business/useCases/orderAdvancedSearchInteractor';

/**
 * used for fetching orders matching the provided search string
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const orderAdvancedSearchLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await orderAdvancedSearchInteractor(
        applicationContext,
        event.queryStringParameters,
        authorizedUser,
      );
    },
    authorizedUser,
  );
