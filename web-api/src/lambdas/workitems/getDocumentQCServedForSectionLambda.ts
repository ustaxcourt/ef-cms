import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getDocumentQCServedForSectionInteractor } from '@web-api/business/useCases/workItems/getDocumentQCServedForSectionInteractor';

/**
 * returns all sent work items in a particular section
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getDocumentQCServedForSectionLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      const { section } = event.pathParameters || {};
      return await getDocumentQCServedForSectionInteractor(
        applicationContext,
        {
          section,
        },
        authorizedUser,
      );
    },
    authorizedUser,
  );
