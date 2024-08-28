import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getDownloadPolicyUrlInteractor } from '@web-api/business/useCases/document/getDownloadPolicyUrlInteractor';

/**
 * TODO: clone of downloadPolicyUrlLambda?
 * used for getting the download policy which is needed for users to download files directly from S3 via the UI
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getDocumentDownloadUrlLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await getDownloadPolicyUrlInteractor(
      applicationContext,
      event.pathParameters,
      authorizedUser,
    );
  });
