import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { removeCasePendingItemInteractor } from '@shared/business/useCases/removeCasePendingItemInteractor';

/**
 * used for removing pending items from a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const removeCasePendingItemLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await removeCasePendingItemInteractor(
        applicationContext,
        {
          ...event.pathParameters,
        },
        authorizedUser,
      );
    },
    authorizedUser,
  );
