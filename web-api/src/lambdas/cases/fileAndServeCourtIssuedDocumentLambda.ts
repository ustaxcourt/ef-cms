import { genericHandler } from '../../genericHandler';

/**
 * File and serve court issued document
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const fileAndServeCourtIssuedDocumentLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
        ...JSON.parse(event.body),
      });
  });
