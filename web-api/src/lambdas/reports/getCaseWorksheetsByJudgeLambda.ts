import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getCaseWorksheetsByJudgeInteractor } from '@web-api/business/useCases/judgeActivityReport/getCaseWorksheetsByJudgeInteractor';

export const getCaseWorksheetsByJudgeLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,

    async ({ applicationContext }) => {
      return await getCaseWorksheetsByJudgeInteractor(
        applicationContext,
        event.queryStringParameters,
        authorizedUser,
      );
    },
    { logResults: false },
  );
