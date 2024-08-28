import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getDownloadPolicyUrlInteractor } from '@web-api/business/useCases/document/getDownloadPolicyUrlInteractor';
import { marshallDocumentDownloadUrl } from './marshallers/marshallDocumentDownloadUrl';
import { v1ApiWrapper } from './v1ApiWrapper';

/**
 * used for getting the download policy which is needed for consumers to download files directly from S3
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getDocumentDownloadUrlLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, ({ applicationContext }) => {
    return v1ApiWrapper(async () => {
      const urlObject = await getDownloadPolicyUrlInteractor(
        applicationContext,
        {
          ...event.pathParameters,
        },
        authorizedUser,
      );

      return marshallDocumentDownloadUrl(urlObject);
    });
  });
