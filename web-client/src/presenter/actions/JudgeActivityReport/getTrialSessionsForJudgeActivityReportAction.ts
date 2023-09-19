import { ID_FOR_ALL_JUDGES } from '@shared/business/useCases/judgeActivityReport/getTrialSessionsForJudgeActivityReportInteractor';
import { state } from '@web-client/presenter/app.cerebral';

export const getTrialSessionsForJudgeActivityReportAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { endDate, judgeName, startDate } = get(
    state.judgeActivityReport.filters,
  );

  let judgeIdForRequest: string = ID_FOR_ALL_JUDGES;

  if (judgeName !== 'All Judges') {
    const listOfJudges = get(state.judges);

    const judgeInfo = listOfJudges.find(
      eachJudge => eachJudge.name === judgeName,
    );

    judgeIdForRequest = judgeInfo!.userId;
  }

  const trialSessions = await applicationContext
    .getUseCases()
    .getTrialSessionsForJudgeActivityReportInteractor(applicationContext, {
      endDate,
      judgeId: judgeIdForRequest,
      startDate,
    });

  return { trialSessions };
};
