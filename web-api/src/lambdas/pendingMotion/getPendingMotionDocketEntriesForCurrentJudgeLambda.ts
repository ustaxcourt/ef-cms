import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getPendingMotionDocketEntriesForCurrentJudgeInteractor } from '@web-api/business/useCases/pendingMotion/getPendingMotionDocketEntriesForCurrentJudgeInteractor';

export const getPendingMotionDocketEntriesForCurrentJudgeLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, ({ applicationContext }) =>
    getPendingMotionDocketEntriesForCurrentJudgeInteractor(
      applicationContext,
      event.queryStringParameters,
      authorizedUser,
    ),
  );
