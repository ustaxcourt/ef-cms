import { genericHandler } from '../../genericHandler';

/**
 * used for fetching opinions matching the provided search string
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const opinionAdvancedSearchLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const opinionTypes =
      event.queryStringParameters.opinionTypes?.split(',') || [];

    return await applicationContext
      .getUseCases()
      .opinionAdvancedSearchInteractor(applicationContext, {
        ...event.queryStringParameters,
        opinionTypes,
      });
  });
