import { genericHandler } from '../../genericHandler';

/**
 * deletes a statistic from the case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const deleteDeficiencyStatisticLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .deleteDeficiencyStatisticInteractor(applicationContext, {
        ...event.pathParameters,
      });
  });
