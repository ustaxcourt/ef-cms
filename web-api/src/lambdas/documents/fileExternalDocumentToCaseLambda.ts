import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { fileExternalDocumentInteractor } from '@web-api/business/useCases/externalDocument/fileExternalDocumentInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * lambda which is used for adding an external document to a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const fileExternalDocumentToCaseLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await fileExternalDocumentInteractor(
      applicationContext,
      JSON.parse(event.body),
      authorizedUser,
    );
  });
