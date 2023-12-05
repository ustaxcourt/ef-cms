import { genericHandler } from '../../genericHandler';

/**
 * get case deadlines between start and end date
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getCaseDeadlinesLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getCaseDeadlinesInteractor(applicationContext, {
        ...event.queryStringParameters,
      });
  });
