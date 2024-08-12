import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { archiveCorrespondenceDocumentInteractor } from '@web-api/business/useCases/correspondence/archiveCorrespondenceDocumentInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * archive a correspondence document
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const archiveCorrespondenceDocumentLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await archiveCorrespondenceDocumentInteractor(
      applicationContext,
      {
        ...event.pathParameters,
      },
      authorizedUser,
    );
  });
