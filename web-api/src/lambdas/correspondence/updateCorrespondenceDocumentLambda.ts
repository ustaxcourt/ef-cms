import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { updateCorrespondenceDocumentInteractor } from '@web-api/business/useCases/correspondence/updateCorrespondenceDocumentInteractor';

/**
 * upload a correspondence document
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const updateCorrespondenceDocumentLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await updateCorrespondenceDocumentInteractor(
      applicationContext,
      {
        ...JSON.parse(event.body),
      },
      authorizedUser,
    );
  });
