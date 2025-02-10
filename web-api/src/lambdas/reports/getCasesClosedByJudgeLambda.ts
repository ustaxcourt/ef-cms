import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '@web-api/genericHandler';
import { getCasesClosedByJudgeInteractor } from '@web-api/business/useCases/judgeActivityReport/getCasesClosedByJudgeInteractor';

export const getCasesClosedByJudgeLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async () => {
      return await getCasesClosedByJudgeInteractor(
        {
          ...JSON.parse(event.body),
        },
        authorizedUser,
      );
    },
    { logResults: false },
  );
