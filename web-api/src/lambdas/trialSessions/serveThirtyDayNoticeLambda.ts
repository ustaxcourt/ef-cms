import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';

export const serveThirtyDayNoticeLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    const { clientConnectionId, trialSessionId } = JSON.parse(event.body);
    return await applicationContext
      .getUseCases()
      .serveThirtyDayNoticeInteractor(
        applicationContext,
        {
          clientConnectionId,
          trialSessionId,
        },
        authorizedUser,
      );
  });
