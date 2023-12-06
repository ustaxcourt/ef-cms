import { genericHandler } from '../../genericHandler';

export const serveThirtyDayNoticeLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { trialSessionId } = JSON.parse(event.body);
    return await applicationContext
      .getUseCases()
      .serveThirtyDayNoticeInteractor(applicationContext, {
        trialSessionId,
      });
  });
