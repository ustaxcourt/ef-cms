import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getCasesClosedByJudgeInteractor } from '@web-api/business/useCases/judgeActivityReport/getCasesClosedByJudgeInteractor';

export const getCasesClosedByJudgeLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await getCasesClosedByJudgeInteractor(
        applicationContext,
        {
          ...JSON.parse(event.body),
        },
        authorizedUser,
      );
    },
    { logResults: false },
  );
