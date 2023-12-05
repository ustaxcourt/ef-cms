import { genericHandler } from '../../genericHandler';

/**
 * gets trial session details
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getTrialSessionDetailsLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { trialSessionId } = event.pathParameters || {};

    return await applicationContext
      .getUseCases()
      .getTrialSessionDetailsInteractor(applicationContext, {
        trialSessionId,
      });
  });
