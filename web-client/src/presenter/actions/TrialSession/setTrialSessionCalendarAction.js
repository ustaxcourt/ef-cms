import { state } from 'cerebral';

/**
 * set trial session calendar
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {object} the trialSession with cases
 */
export const setTrialSessionCalendarAction = async ({
  applicationContext,
  get,
}) => {
  const trialSessionId = get(state.trialSession.trialSessionId);

  const trialSession = await applicationContext
    .getUseCases()
    .setTrialSessionCalendarInteractor(applicationContext, {
      trialSessionId,
    });

  return { trialSessionId: trialSession.trialSessionId };
};
