import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { replyToMessageInteractor } from '@web-api/business/useCases/messages/replyToMessageInteractor';

/**
 * lambda which is used to reply to a message
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const replyToMessageLambda = (event, authorizedUser: UnknownAuthUser) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await replyToMessageInteractor(
      applicationContext,
      {
        parentMessageId: event.pathParameters.parentMessageId,
        ...JSON.parse(event.body),
      },
      authorizedUser,
    );
  });
