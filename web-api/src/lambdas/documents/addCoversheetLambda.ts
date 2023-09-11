import { genericHandler } from '../../genericHandler';

/**
 * used for adding a coversheet to a new document
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const addCoversheetLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      await applicationContext
        .getUseCases()
        .addCoversheetInteractor(applicationContext, event.pathParameters);
    },
    { logResults: false },
  );
