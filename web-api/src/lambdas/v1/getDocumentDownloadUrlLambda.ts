import { genericHandler } from '../../genericHandler';
import { marshallDocumentDownloadUrl } from './marshallers/marshallDocumentDownloadUrl';
import { v1ApiWrapper } from './v1ApiWrapper';

/**
 * used for getting the download policy which is needed for consumers to download files directly from S3
 *
 * @param {object} event the AWS event object
 * @param {object} options options to optionally pass to the genericHandler
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getDocumentDownloadUrlLambda = (event, options = {}) =>
  genericHandler(
    event,
    ({ applicationContext }) => {
      return v1ApiWrapper(async () => {
        const urlObject = await applicationContext
          .getUseCases()
          .getDownloadPolicyUrlInteractor(applicationContext, {
            ...event.pathParameters,
          });

        return marshallDocumentDownloadUrl(urlObject);
      });
    },
    options,
  );
