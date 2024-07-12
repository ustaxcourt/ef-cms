import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getDocumentQCInboxForUserInteractor } from '@web-api/business/useCases/workItems/getDocumentQCInboxForUserInteractor';

/**
 * returns the users inbox
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getDocumentQCInboxForUserLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      const { userId } = event.pathParameters || {};

      return await getDocumentQCInboxForUserInteractor(
        applicationContext,
        {
          userId,
        },
        authorizedUser,
      );
    },
    authorizedUser,
  );
