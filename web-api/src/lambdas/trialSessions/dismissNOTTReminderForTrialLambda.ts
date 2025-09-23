import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { dismissNOTTReminderForTrialInteractor } from '@web-api/business/useCases/trialSessions/dismissNOTTReminderForTrialInteractor';
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
  genericHandler(event, async () => {
    return await dismissNOTTReminderForTrialInteractor(
      {
        ...JSON.parse(event.body),
      },
      authorizedUser,
    );
  });
