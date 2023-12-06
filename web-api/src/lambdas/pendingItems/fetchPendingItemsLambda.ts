import { genericHandler } from '../../genericHandler';

/**
 * used for fetching pending items
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const fetchPendingItemsLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .fetchPendingItemsInteractor(applicationContext, {
        ...event.queryStringParameters,
      });
  });
