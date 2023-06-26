import { state } from '@web-client/presenter/app.cerebral';

/**
 * dismisses the NOTT alert on a trial session
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext object
 * @param {object} providers.get the cerebral get method
 * @param {object} providers.path provides execution path choices
 * @returns {object} the path to call
 */
export const dismissThirtyDayAlertFromTrialSessionAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const { trialSessionId } = get(state.formattedTrialSessionDetails);

  try {
    await applicationContext
      .getUseCases()
      .dismissNOTTReminderForTrialInteractor(applicationContext, {
        trialSessionId,
      });
  } catch (err) {
    return path.error({
      alertError: {
        message: 'Please try again.',
        title: 'Alert could not be dismissed.',
      },
    });
  }

  return path.success({ trialSessionId });
};
