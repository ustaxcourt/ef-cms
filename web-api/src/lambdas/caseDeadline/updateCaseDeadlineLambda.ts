import { genericHandler } from '../../genericHandler';

/**
 * update case deadline
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const updateCaseDeadlineLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .updateCaseDeadlineInteractor(applicationContext, {
        ...JSON.parse(event.body),
      });
  });
