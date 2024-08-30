import { genericHandler } from '../../genericHandler';
import { opinionPublicSearchInteractor } from '@web-api/business/useCases/public/opinionPublicSearchInteractor';

/**
 * used for fetching opinions matching the given filters
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const opinionPublicSearchLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const opinionTypes =
      event.queryStringParameters.opinionTypes?.split(',') || [];

    return await opinionPublicSearchInteractor(applicationContext, {
      ...event.queryStringParameters,
      opinionTypes,
    });
  });
