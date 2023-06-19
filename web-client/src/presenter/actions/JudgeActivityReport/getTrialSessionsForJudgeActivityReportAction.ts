import { state } from '@web-client/presenter/app.cerebral';

export const getTrialSessionsForJudgeActivityReportAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { endDate, judgesSelection, startDate } = get(
    state.judgeActivityReport.filters,
  );

  const judgeUsers: Array<{
    name: string;
    userId: string;
  }> = get(state.judges);

  const judgesIds = judgesSelection
    .map(name =>
      judgeUsers.filter(jdgObj => jdgObj.name === name).map(obj => obj.userId),
    )
    .flat();

  const trialSessions = await applicationContext
    .getUseCases()
    .getTrialSessionsForJudgeActivityReportInteractor(applicationContext, {
      endDate,
      judgesSelection: judgesIds,
      startDate,
    });

  return { trialSessions };
};
