import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';

export const getCaseWorksheetsByJudgeLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,

    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .getCaseWorksheetsByJudgeInteractor(
          applicationContext,
          event.queryStringParameters,
          authorizedUser,
        );
    },
    { logResults: false },
  );
