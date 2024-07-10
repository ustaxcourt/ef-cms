import { state } from '@web-client/presenter/app.cerebral';

/**
 * set trial session calendar
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {object} the trialSession with cases
 */
export const setTrialSessionCalendarAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const trialSessionId = get(state.trialSession.trialSessionId);
  const clientConnectionId = get(state.clientConnectionId);
  if (!trialSessionId) {
    throw new Error('Unable to set trial session without a trial sessionId');
  }

  await applicationContext
    .getUseCases()
    .setTrialSessionCalendarInteractor(applicationContext, {
      clientConnectionId,
      trialSessionId,
    });

  return { trialSessionId };
};
