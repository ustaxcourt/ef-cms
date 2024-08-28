import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { fileCorrespondenceDocumentInteractor } from '@web-api/business/useCases/correspondence/fileCorrespondenceDocumentInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * adds a correspondence document to the case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const fileCorrespondenceDocumentLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await fileCorrespondenceDocumentInteractor(
      applicationContext,
      {
        ...JSON.parse(event.body),
      },
      authorizedUser,
    );
  });
