import { genericHandler } from '../../genericHandler';
import { getTodaysOrdersInteractor } from '@web-api/business/useCases/public/getTodaysOrdersInteractor';

/**
 * used for fetching orders served on the current date
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const todaysOrdersLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await getTodaysOrdersInteractor(
      applicationContext,
      event.pathParameters,
    );
  });
