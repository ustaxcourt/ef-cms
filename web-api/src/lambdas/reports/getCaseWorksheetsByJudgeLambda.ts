import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getCaseWorksheetsByJudgeInteractor } from '@web-api/business/useCases/judgeActivityReport/getCaseWorksheetsByJudgeInteractor';

export const getCaseWorksheetsByJudgeLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) => {
  const rawJudges = event.queryStringParameters?.judges;
  const judges = Array.isArray(rawJudges)
    ? rawJudges
    : typeof rawJudges === 'object' && rawJudges !== null
      ? Object.values(rawJudges)
      : rawJudges
        ? [rawJudges]
        : [];

  const rawStatuses = event.queryStringParameters?.statuses;
  const statuses = Array.isArray(rawStatuses)
    ? rawStatuses
    : typeof rawStatuses === 'object' && rawStatuses !== null
      ? Object.values(rawStatuses)
      : rawStatuses
        ? [rawStatuses]
        : [];

  return genericHandler(
    event,
    async () => {
      return await getCaseWorksheetsByJudgeInteractor(
        { judges, statuses },
        authorizedUser,
      );
    },
    { logResults: false },
  );
};
