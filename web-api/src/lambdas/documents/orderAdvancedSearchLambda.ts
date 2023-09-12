import { genericHandler } from '../../genericHandler';

/**
 * used for fetching orders matching the provided search string
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const orderAdvancedSearchLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .orderAdvancedSearchInteractor(
        applicationContext,
        event.queryStringParameters,
      );
  });
