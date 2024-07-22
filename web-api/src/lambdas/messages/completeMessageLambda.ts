import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';

/**
 * lambda which is used to complete a message thread
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const completeMessageLambda = (event, authorizedUser: UnknownAuthUser) =>
  genericHandler(
    event,
    async ({
      applicationContext,
    }: {
      applicationContext: ServerApplicationContext;
    }) => {
      return await applicationContext
        .getUseCases()
        .completeMessageInteractor(
          applicationContext,
          JSON.parse(event.body),
          authorizedUser,
        );
    },
  );
