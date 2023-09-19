import { genericHandler } from '../../genericHandler';

/**
 * used for marking a case as unsealed
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const unsealCaseLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .unsealCaseInteractor(applicationContext, {
        ...event.pathParameters,
      });
  });
