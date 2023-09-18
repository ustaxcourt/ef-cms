import { state } from '@web-client/presenter/app.cerebral';

export const createTrialSessionAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  let result;
  try {
    result = await applicationContext
      .getUseCases()
      .createTrialSessionInteractor(applicationContext, {
        trialSession: get(state.form),
      });
  } catch (err) {
    return path.error({
      alertError: {
        message: 'Please try again.',
        title: 'Trial session could not be added.',
      },
    });
  }

  return path.success({
    trialSession: result.trialSessionId,
  });
};
