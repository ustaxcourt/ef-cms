import { genericHandler } from '../../genericHandler';

/**
 * get case deadlines for case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getCaseDeadlinesForCaseLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getCaseDeadlinesForCaseInteractor(applicationContext, {
        docketNumber: event.pathParameters.docketNumber,
      });
  });
