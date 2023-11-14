import { genericHandler } from '../../genericHandler';

/**
 * updates a trial session.
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const updateTrialSessionLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .updateTrialSessionInteractor(applicationContext, {
        ...JSON.parse(event.body),
      });
  });
