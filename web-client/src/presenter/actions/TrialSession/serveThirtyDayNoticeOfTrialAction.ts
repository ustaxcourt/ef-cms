import { state } from '@web-client/presenter/app.cerebral';

export const serveThirtyDayNoticeOfTrialAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { trialSessionId } = get(state.trialSession);

  await applicationContext
    .getUseCases()
    .serveThirtyDayNoticeInteractor(applicationContext, {
      trialSessionId,
    });
};
