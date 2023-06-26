import { TEMP_JUDGE_ID_TO_REPRESENT_ALL_JUDGES_SELECTION } from '../../../../../shared/src/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const getTrialSessionsForJudgeActivityReportAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { endDate, judgeName, startDate } = get(
    state.judgeActivityReport.filters,
  );

  let userIdForRequest: string =
    TEMP_JUDGE_ID_TO_REPRESENT_ALL_JUDGES_SELECTION;

  if (judgeName !== 'All Judges') {
    const allJudges: Array<{
      role?: string;
      userId?: string;
      name?: string;
    }> = get(state.judges);

    const { userId } = (allJudges || []).find(
      eachJudge => eachJudge.name === judgeName,
    );

    userIdForRequest = userId;
  }

  const trialSessions = await applicationContext
    .getUseCases()
    .getTrialSessionsForJudgeActivityReportInteractor(applicationContext, {
      endDate,
      judgeId: userIdForRequest,
      startDate,
    });

  return { trialSessions };
};
