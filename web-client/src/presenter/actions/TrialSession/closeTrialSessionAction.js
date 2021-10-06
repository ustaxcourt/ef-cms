import { state } from 'cerebral';

/**
 * set trial session status to closed
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {object} the trialSession with cases
 */
export const closeTrialSessionAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const trialSessionId = get(state.trialSession.trialSessionId);

  let trialSession;
  try {
    trialSession = await applicationContext
      .getUseCases()
      .closeTrialSessionInteractor(applicationContext, {
        trialSessionId,
      });
  } catch (e) {
    return path.error({
      alertError: {
        message: 'Please try again.',
        title: e.message,
      },
    });
  }
  return path.success({
    alertSuccess: 'Trial Session Closed.',
    trialSessionId: trialSession.trialSessionId,
  });
};
