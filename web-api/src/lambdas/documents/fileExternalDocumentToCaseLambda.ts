import { genericHandler } from '../../genericHandler';

/**
 * lambda which is used for adding an external document to a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const fileExternalDocumentToCaseLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .fileExternalDocumentInteractor(
        applicationContext,
        JSON.parse(event.body),
      );
  });
