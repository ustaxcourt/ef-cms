import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { setMessageAsReadInteractor } from '@web-api/business/useCases/messages/setMessageAsReadInteractor';

/**
 * sets the given message's read status
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const setMessageAsReadLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    const { messageId } = event.pathParameters || {};

    return await setMessageAsReadInteractor(
      applicationContext,
      {
        messageId,
        ...JSON.parse(event.body),
      },
      authorizedUser,
    );
  });
