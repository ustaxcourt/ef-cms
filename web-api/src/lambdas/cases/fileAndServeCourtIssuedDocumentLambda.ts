import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { fileAndServeCourtIssuedDocumentInteractor } from '@web-api/business/useCases/courtIssuedDocument/fileAndServeCourtIssuedDocumentInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * File and serve court issued document
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const fileAndServeCourtIssuedDocumentLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await fileAndServeCourtIssuedDocumentInteractor(
        applicationContext,
        {
          ...JSON.parse(event.body),
        },
        authorizedUser,
      );
    },
    authorizedUser,
  );
