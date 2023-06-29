import { state } from '@web-client/presenter/app.cerebral';

/**
 * Fetches the trial sessions for a judge user id
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getCase use case
 * @returns {object} contains the trial sessions returned from the use case
 */
export const getTrialSessionsForJudgeAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { role, userId } = applicationContext.getCurrentUser();
  const { USER_ROLES } = applicationContext.getConstants();
  const chambersJudgeUser = get(state.judgeUser);
  const isChambersUser = role === USER_ROLES.chambers;
  const judgeUserId =
    isChambersUser && chambersJudgeUser ? chambersJudgeUser.userId : userId;

  const trialSessions = await applicationContext
    .getUseCases()
    .getTrialSessionsForJudgeInteractor(applicationContext, judgeUserId);

  return { trialSessions };
};
