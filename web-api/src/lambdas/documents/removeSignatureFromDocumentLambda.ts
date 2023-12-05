import { genericHandler } from '../../genericHandler';

/**
 * used for removing signature from a signed document
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const removeSignatureFromDocumentLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .removeSignatureFromDocumentInteractor(
        applicationContext,
        event.pathParameters,
      );
  });
