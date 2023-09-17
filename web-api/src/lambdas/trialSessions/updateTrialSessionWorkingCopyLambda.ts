import { genericHandler } from '../../genericHandler';

/**
 * update a judge's working copy of a trial session
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const updateTrialSessionWorkingCopyLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .updateTrialSessionWorkingCopyInteractor(applicationContext, {
        trialSessionWorkingCopyToUpdate: JSON.parse(event.body),
      });
  });
