import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getDownloadPolicyUrlInteractor } from '@shared/business/useCases/getDownloadPolicyUrlInteractor';
import { marshallDocumentDownloadUrl } from './marshallers/marshallDocumentDownloadUrl';
import { v2ApiWrapper } from './v2ApiWrapper';

/**
 * used for getting the download policy which is needed for consumers to download files directly from S3
 *
 * @param {object} event the AWS event object
 * @param {object} options options to optionally pass to the genericHandler
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getDocumentDownloadUrlLambda = (
  event,
  authorizedUser: UnknownAuthUser,
  options = {},
) =>
  genericHandler(
    event,
    ({ applicationContext }) => {
      return v2ApiWrapper(async () => {
        const urlObject = await getDownloadPolicyUrlInteractor(
          applicationContext,
          {
            ...event.pathParameters,
          },
          authorizedUser,
        );

        return marshallDocumentDownloadUrl(urlObject);
      });
    },
    authorizedUser,
    options,
  );
