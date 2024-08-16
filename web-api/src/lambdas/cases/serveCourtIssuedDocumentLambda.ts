import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { serveCourtIssuedDocumentInteractor } from '@web-api/business/useCases/courtIssuedDocument/serveCourtIssuedDocumentInteractor';

/**
 * used for serving a court-issued document on all parties and closing the case for some document types
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const serveCourtIssuedDocumentLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await serveCourtIssuedDocumentInteractor(
        applicationContext,
        {
          ...JSON.parse(event.body),
        },
        authorizedUser,
      );
    },
    { logResults: false },
  );
