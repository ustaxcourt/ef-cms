import { genericHandler } from '../../genericHandler';

export const getTrialSessionsForJudgeActivityReportLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .getTrialSessionsForJudgeActivityReportInteractor(applicationContext, {
          ...JSON.parse(event.body),
        });
    },
    { logResults: false },
  );
