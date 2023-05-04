import { state } from 'cerebral';
/**
 * sets the state.screenMetadata.showNewTab depending on the user role
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
}) => {
  const trialSession = {
    ...get(state.formattedTrialSessionDetails),
    dismissedAlertForNOTT: true,
  };

  try {
    await applicationContext
      .getUseCases()
      .updateTrialSessionInteractor(applicationContext, {
        trialSession,
      });
  } catch (err) {
    return path.error({
      alertError: {
        message: 'Please try again.',
        title: 'Alert could not be dismissed.',
      },
    });
  }

  return path.success();
};
