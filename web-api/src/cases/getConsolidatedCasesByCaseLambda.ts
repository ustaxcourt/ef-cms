import { genericHandler } from '../genericHandler';

/**
 * used for fetching all cases (including consolidated) of a particular status, user role, etc
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getConsolidatedCasesByCaseLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getConsolidatedCasesByCaseInteractor(applicationContext, {
        ...event.pathParameters,
      });
  });
