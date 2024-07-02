import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getOutboxMessagesForUserInteractor } from '@web-api/business/useCases/messages/getOutboxMessagesForUserInteractor';

/**
 * gets the outbox messages for the user
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getOutboxMessagesForUserLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await getOutboxMessagesForUserInteractor(
        applicationContext,
        {
          userId: event.pathParameters.userId,
        },
        authorizedUser,
      );
    },
    authorizedUser,
  );
