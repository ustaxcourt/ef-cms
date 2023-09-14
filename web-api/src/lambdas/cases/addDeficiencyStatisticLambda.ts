import { genericHandler } from '../../genericHandler';

/**
 * adds a statistic to the case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const addDeficiencyStatisticLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .addDeficiencyStatisticInteractor(applicationContext, {
        ...event.pathParameters,
        ...JSON.parse(event.body),
      });
  });
