import { genericHandler } from '../genericHandler';

export const serveThirtyDayNoticeLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .serveThirtyDayNoticeInteractor(applicationContext, {
        trialSessionId: JSON.parse(event.body.trialSessionId),
      });
  });
