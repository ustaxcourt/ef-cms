import { genericHandler } from '../../genericHandler';

/**
 * used for getting the upload policy which is needed for users to upload directly to S3 via the UI
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getUploadPolicyLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getUploadPolicyInteractor(applicationContext, {
        key: event.pathParameters.key,
      });
  });
