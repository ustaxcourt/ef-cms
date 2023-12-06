import { state } from '@web-client/presenter/app.cerebral';

/**
 * set trial session status to closed
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {object} the trialSession with cases
 */
export const closeTrialSessionAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
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
        title: 'Unable to close trial session.',
      },
    });
  }

  return path.success({
    alertSuccess: {
      message: 'Trial session closed.',
    },
    trialSessionId: trialSession.trialSessionId,
  });
};
