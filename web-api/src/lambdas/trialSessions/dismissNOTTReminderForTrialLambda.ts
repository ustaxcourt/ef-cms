import { genericHandler } from '../../genericHandler';

/**
 * dismisses an NOTT reminder alert on a trial session
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const dismissNOTTReminderForTrialLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .dismissNOTTReminderForTrialInteractor(applicationContext, {
        ...JSON.parse(event.body),
      });
  });
