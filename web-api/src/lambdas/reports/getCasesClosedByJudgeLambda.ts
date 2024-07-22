import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';

export const getCasesClosedByJudgeLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .getCasesClosedByJudgeInteractor(
          applicationContext,
          {
            ...JSON.parse(event.body),
          },
          authorizedUser,
        );
    },
    { logResults: false },
  );
