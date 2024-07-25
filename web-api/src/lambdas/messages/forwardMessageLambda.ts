import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { forwardMessageInteractor } from '@web-api/business/useCases/messages/forwardMessageInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * lambda which is used to forward a message
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const forwardMessageLambda = (event, authorizedUser: UnknownAuthUser) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await forwardMessageInteractor(
      applicationContext,
      {
        parentMessageId: event.pathParameters.parentMessageId,
        ...JSON.parse(event.body),
      },
      authorizedUser,
    );
  });
