import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getPublicDownloadPolicyUrlInteractor } from '@web-api/business/useCases/public/getPublicDownloadPolicyUrlInteractor';

/**
 * used for fetching a single case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getPublicDocumentDownloadUrlLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await getPublicDownloadPolicyUrlInteractor(
      applicationContext,
      {
        ...event.pathParameters,
        isTerminalUser: event.isTerminalUser,
      },
      authorizedUser,
    );
  });
