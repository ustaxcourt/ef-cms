import { genericHandler } from '../../genericHandler';

/**
 * upload a correspondence document
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const updateCorrespondenceDocumentLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .updateCorrespondenceDocumentInteractor(applicationContext, {
        ...JSON.parse(event.body),
      });
  });
