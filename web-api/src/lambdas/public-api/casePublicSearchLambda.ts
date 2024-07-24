import { casePublicSearchInteractor } from '@web-api/business/useCases/public/casePublicSearchInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * used for fetching cases matching the given name, country, state, and/or year filed range for the general public
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const casePublicSearchLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await casePublicSearchInteractor(applicationContext, {
      ...event.queryStringParameters,
    });
  });
