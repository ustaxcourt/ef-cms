import { genericHandler } from '../../genericHandler';
import { getTodaysOpinionsInteractor } from '@web-api/business/useCases/public/getTodaysOpinionsInteractor';

/**
 * used for fetching opinions created for the current date
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const todaysOpinionsLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await getTodaysOpinionsInteractor(applicationContext);
  });
