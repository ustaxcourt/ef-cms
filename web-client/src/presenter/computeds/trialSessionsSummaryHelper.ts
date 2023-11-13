import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const trialSessionsSummaryHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
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
