import { genericHandler } from '../genericHandler';

/**
 * updates a trial session.
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const dismissNOTTReminderForTrialLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    console.log(JSON.parse(event.body), 'lambda');
    return await applicationContext
      .getUseCases()
      .dismissNOTTReminderForTrialInteractor(
        applicationContext,
        ...JSON.parse(event.body),
      );
  });
