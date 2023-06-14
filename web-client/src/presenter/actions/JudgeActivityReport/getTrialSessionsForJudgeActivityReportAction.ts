import { state } from 'cerebral';

// TODO: ADJUST LOGIC TO GET ALL JUDGES IDS AND PASS TO INTERACTOR
export const getTrialSessionsForJudgeActivityReportAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { endDate, startDate } = get(state.judgeActivityReport.filters);
  const { role, userId } = applicationContext.getCurrentUser();
  const { USER_ROLES } = applicationContext.getConstants();
  const chambersJudgeUser = get(state.judgeUser);
  const isChambersUser = role === USER_ROLES.chambers;
  const judgeId =
    isChambersUser && chambersJudgeUser ? chambersJudgeUser.userId : userId;

  const trialSessions = await applicationContext
    .getUseCases()
    .getTrialSessionsForJudgeActivityReportInteractor(applicationContext, {
      endDate,
      judgeId,
      startDate,
    });

  return { trialSessions };
};
