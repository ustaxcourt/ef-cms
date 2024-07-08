import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getUploadPolicyInteractor } from '@web-api/business/useCases/document/getUploadPolicyInteractor';

/**
 * used for getting the upload policy which is needed for users to upload directly to S3 via the UI
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getUploadPolicyLambda = (event, authorizedUser: UnknownAuthUser) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await getUploadPolicyInteractor(
        applicationContext,
        {
          key: event.pathParameters.key,
        },
        authorizedUser,
      );
    },
    authorizedUser,
  );
