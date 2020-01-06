import { state } from 'cerebral';

/**
 * calls proxy endpoint to generate notices for the given trial session
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @returns {void}
 */
export const setNoticesForCalendaredTrialSessionAction = async ({
  applicationContext,
  get,
}) => {
  const { trialSessionId } = get(state.trialSession);

  await applicationContext
    .getUseCases()
    .setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
      trialSessionId,
    });
};
