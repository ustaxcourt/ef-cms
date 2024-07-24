import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { saveSignedDocumentInteractor } from '@shared/business/useCases/saveSignedDocumentInteractor';

/**
 * used for signing PDF documents
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const saveSignedDocumentLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    const {
      body,
      pathParameters: { docketEntryId: originalDocketEntryId, docketNumber },
    } = event;

    return await saveSignedDocumentInteractor(
      applicationContext,
      {
        ...JSON.parse(body),
        docketNumber,
        originalDocketEntryId,
      },
      authorizedUser,
    );
  });
