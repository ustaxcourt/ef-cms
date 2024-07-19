import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';

/**
 * dismisses an NOTT reminder alert on a trial session
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const dismissNOTTReminderForTrialLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .dismissNOTTReminderForTrialInteractor(
        applicationContext,
        authorizedUser,
        {
          ...JSON.parse(event.body),
        },
      );
  });
