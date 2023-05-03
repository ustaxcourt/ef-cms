import { state } from 'cerebral';
/**
 * sets the state.screenMetadata.showNewTab depending on the user role
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.query
 * @param {object} providers.store the cerebral store used for setting the state.screenMetadata.trialSessionFilters
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
        title: 'Trial session could not be edited.',
      },
    });
  }
  return path.success({ trialSessionId: trialSession.trialSessionId });
};
