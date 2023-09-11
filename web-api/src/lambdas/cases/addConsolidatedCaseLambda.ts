import { genericHandler } from '../../genericHandler';

/**
 * used for consolidating cases
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const addConsolidatedCaseLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    await applicationContext
      .getUseCases()
      .addConsolidatedCaseInteractor(applicationContext, {
        ...event.pathParameters,
        ...JSON.parse(event.body),
      });
  });
