import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getTrialSessionsForJudgeActivityReportInteractor } from '@web-api/business/useCases/judgeActivityReport/getTrialSessionsForJudgeActivityReportInteractor';

export const getTrialSessionsForJudgeActivityReportLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await getTrialSessionsForJudgeActivityReportInteractor(
        applicationContext,
        {
          ...JSON.parse(event.body),
        },
        authorizedUser,
      );
    },
    { logResults: false },
  );
