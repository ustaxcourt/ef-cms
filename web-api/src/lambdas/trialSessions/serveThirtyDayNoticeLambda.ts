import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { serveThirtyDayNoticeInteractor } from '@web-api/business/useCases/trialSessions/serveThirtyDayNoticeInteractor';

export const serveThirtyDayNoticeLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    const { clientConnectionId, trialSessionId } = JSON.parse(event.body);
    return await serveThirtyDayNoticeInteractor(
      applicationContext,
      {
        clientConnectionId,
        trialSessionId,
      },
      authorizedUser,
    );
  });
