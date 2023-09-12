import { genericHandler } from '../../genericHandler';

/**
 * closes a trial session.
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const closeTrialSessionLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { trialSessionId } = event.pathParameters || {};

    return await applicationContext
      .getUseCases()
      .closeTrialSessionInteractor(applicationContext, {
        trialSessionId,
      });
  });
