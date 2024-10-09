import { getJudgesFilters } from '@web-client/presenter/actions/PendingMotion/getPendingMotionDocketEntriesAction';
import { state } from '@web-client/presenter/app.cerebral';

export const getTrialSessionsForJudgeActivityReportAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { endDate, startDate } = get(state.judgeActivityReport.filters);

  const trialSessions = await applicationContext
    .getUseCases()
    .getTrialSessionsForJudgeActivityReportInteractor(applicationContext, {
      endDate,
      judgeIds: getJudgesFilters(get).map(judge => judge.userId),
      startDate,
    });

  return { trialSessions };
};
