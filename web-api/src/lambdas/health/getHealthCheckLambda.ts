import { genericHandler } from '../../genericHandler';
import { getHealthCheckInteractor } from '@web-api/business/useCases/health/getHealthCheckInteractor';

/**
 * used for checking status of critical services
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the status of critical services
 */
export const getHealthCheckLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await getHealthCheckInteractor(applicationContext);
  });
