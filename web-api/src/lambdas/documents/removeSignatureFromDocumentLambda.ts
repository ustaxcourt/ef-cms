import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { removeSignatureFromDocumentInteractor } from '@web-api/business/useCases/removeSignatureFromDocumentInteractor';

/**
 * used for removing signature from a signed document
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const removeSignatureFromDocumentLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    await removeSignatureFromDocumentInteractor(
      applicationContext,
      event.pathParameters,
      authorizedUser,
    );
  });
