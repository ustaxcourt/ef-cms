import { genericHandler } from '../../genericHandler';

/**
 * batch download trial session
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const batchDownloadTrialSessionLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { trialSessionId } = event.pathParameters || event.path;

    return await applicationContext
      .getUseCases()
      .batchDownloadTrialSessionInteractor(applicationContext, {
        trialSessionId,
      });
  });
