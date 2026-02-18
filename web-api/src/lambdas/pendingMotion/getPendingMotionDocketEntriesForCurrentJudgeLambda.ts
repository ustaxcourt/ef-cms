import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getPendingMotionDocketEntriesForCurrentJudgeInteractor } from '@web-api/business/useCases/pendingMotion/getPendingMotionDocketEntriesForCurrentJudgeInteractor';

export const getPendingMotionDocketEntriesForCurrentJudgeLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) => {
  const rawJudgeIds = event.queryStringParameters?.judgeIds;
  const judgeIds = Array.isArray(rawJudgeIds)
    ? rawJudgeIds
    : typeof rawJudgeIds === 'object' && rawJudgeIds !== null
      ? Object.values(rawJudgeIds)
      : rawJudgeIds
        ? [rawJudgeIds]
        : [];

  return genericHandler(event, () =>
    getPendingMotionDocketEntriesForCurrentJudgeInteractor(
      { judgeIds },
      authorizedUser,
    ),
  );
};
