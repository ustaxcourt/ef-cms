import { state } from 'cerebral';

/**
 * Fetches the trial sessions within a date range for the judge activity report
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getCase use case
 * @returns {object} contains the trial sessions returned from the use case
 */
export const getTrialSessionsForJudgeActivityReportAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { endDate, startDate } = get(state.form);

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
