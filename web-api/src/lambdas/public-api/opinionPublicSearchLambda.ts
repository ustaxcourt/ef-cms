import { genericHandler } from '../../genericHandler';

/**
 * used for fetching opinions matching the given filters
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const opinionPublicSearchLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      const opinionTypes =
        event.queryStringParameters.opinionTypes?.split(',') || [];

      return await applicationContext
        .getUseCases()
        .opinionPublicSearchInteractor(applicationContext, {
          ...event.queryStringParameters,
          opinionTypes,
        });
    },
    { user: {} },
  );
