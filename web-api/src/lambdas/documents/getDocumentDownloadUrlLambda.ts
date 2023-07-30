import { genericHandler } from '../../genericHandler';

/**
 * TODO: clone of downloadPolicyUrlLambda?
 * used for getting the download policy which is needed for users to download files directly from S3 via the UI
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getDocumentDownloadUrlLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getDownloadPolicyUrlInteractor(applicationContext, event.pathParameters);
  });
