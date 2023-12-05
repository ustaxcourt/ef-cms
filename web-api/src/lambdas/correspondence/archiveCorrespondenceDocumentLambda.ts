import { genericHandler } from '../../genericHandler';

/**
 * archive a correspondence document
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const archiveCorrespondenceDocumentLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .archiveCorrespondenceDocumentInteractor(applicationContext, {
        ...event.pathParameters,
      });
  });
