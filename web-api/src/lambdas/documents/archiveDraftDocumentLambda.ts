import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { archiveDraftDocumentInteractor } from '@web-api/business/useCases/archiveDraftDocumentInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * archives the draft document information from a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const archiveDraftDocumentLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await archiveDraftDocumentInteractor(
      applicationContext,
      event.pathParameters,
      authorizedUser,
    );
  });
