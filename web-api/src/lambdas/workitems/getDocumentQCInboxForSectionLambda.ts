import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getDocumentQCInboxForSectionInteractor } from '@web-api/business/useCases/workItems/getDocumentQCInboxForSectionInteractor';

/**
 * returns all sent work items in a particular section
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getDocumentQCInboxForSectionLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    const { section } = event.pathParameters || {};

    return await getDocumentQCInboxForSectionInteractor(
      applicationContext,
      {
        section,
        ...event.queryStringParameters,
      },
      authorizedUser,
    );
  });
