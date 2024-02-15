import { genericHandler } from '../../genericHandler';

export const serveThirtyDayNoticeLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { clientConnectionId, trialSessionId } = JSON.parse(event.body);
    return await applicationContext
      .getUseCases()
      .serveThirtyDayNoticeInteractor(applicationContext, {
        clientConnectionId,
        trialSessionId,
      });
  });
