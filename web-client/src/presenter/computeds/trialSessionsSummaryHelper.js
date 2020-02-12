import { state } from 'cerebral';

export const trialSessionsSummaryHelper = (get, applicationContext) => {
  const { role, userId } = applicationContext.getCurrentUser();
  const { USER_ROLES } = applicationContext.getConstants();
  const chambersJudgeUser = get(state.judgeUser);
  const isChambersUser = role === USER_ROLES.chambers;
  const judgeUserId =
    isChambersUser && chambersJudgeUser ? chambersJudgeUser.userId : userId;

  return {
    judgeUserId,
  };
};
