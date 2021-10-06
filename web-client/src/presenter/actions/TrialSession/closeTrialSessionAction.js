import { state } from 'cerebral';

/**
 * set trial session status to closed
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {object} the trialSession with cases
 */
export const closeTrialSessionAction = async ({ applicationContext, get }) => {
  const trialSessionId = get(state.trialSession.trialSessionId);

  const trialSession = await applicationContext
    .getUseCases()
    .setTrialSessionCalendarInteractor(applicationContext, {
      trialSessionId,
    });

  return { trialSessionId: trialSession.trialSessionId };
};
