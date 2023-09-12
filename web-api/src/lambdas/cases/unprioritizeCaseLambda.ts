import { genericHandler } from '../../genericHandler';

/**
 * used for removing the high priority from a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const unprioritizeCaseLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .unprioritizeCaseInteractor(applicationContext, {
        ...event.pathParameters,
      });
  });
