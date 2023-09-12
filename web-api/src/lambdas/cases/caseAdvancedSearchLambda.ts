import { genericHandler } from '../../genericHandler';

/**
 * used for fetching cases matching the given name, country, state, and/or year filed range
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const caseAdvancedSearchLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .caseAdvancedSearchInteractor(applicationContext, {
        ...event.queryStringParameters,
      });
  });
