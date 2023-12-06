import { state } from '@web-client/presenter/app.cerebral';

export const updateTrialSessionAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const clientConnectionId = get(state.clientConnectionId);

  try {
    await applicationContext
      .getUseCases()
      .updateTrialSessionInteractor(applicationContext, {
        clientConnectionId,
        trialSession: get(state.form),
      });
  } catch (err) {
    return path.error({
      alertError: {
        message: 'Please try again.',
        title: 'Trial session could not be edited.',
      },
    });
  }

  return path.success();
};
