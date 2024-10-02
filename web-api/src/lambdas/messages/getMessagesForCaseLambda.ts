import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getMessagesForCaseInteractor } from '@web-api/business/useCases/messages/getMessagesForCaseInteractor';

/**
 * lambda which is used for retrieving messages for a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getMessagesForCaseLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async () => {
    return await getMessagesForCaseInteractor(
      {
        ...event.pathParameters,
      },
      authorizedUser,
    );
  });
