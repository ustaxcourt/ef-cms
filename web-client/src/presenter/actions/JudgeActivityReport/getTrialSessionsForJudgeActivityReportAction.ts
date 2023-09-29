import { state } from '@web-client/presenter/app.cerebral';

export const getTrialSessionsForJudgeActivityReportAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { endDate, judges, startDate } = get(state.judgeActivityReport.filters);

  const trialSessions = await applicationContext
    .getUseCases()
    .getTrialSessionsForJudgeActivityReportInteractor(applicationContext, {
      endDate,
      judges,
      startDate,
    });

  return { trialSessions };
};
