import { state } from '@web-client/presenter/app.cerebral';

export const serveThirtyDayNoticeOfTrialAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { trialSessionId } = get(state.trialSession);
  const clientConnectionId = get(state.clientConnectionId);

  await applicationContext
    .getUseCases()
    .serveThirtyDayNoticeInteractor(applicationContext, {
      clientConnectionId,
      trialSessionId,
    });
};
