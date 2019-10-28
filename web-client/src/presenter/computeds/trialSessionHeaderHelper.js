import { state } from 'cerebral';

export const trialSessionHeaderHelper = (get, applicationContext) => {
  const trialSession = get(state.trialSession);
  const sessionJudgeId = get(state.trialSession.judge.userId);
  const user = applicationContext.getCurrentUser();
  const USER_ROLES = get(state.constants.USER_ROLES);
  if (!trialSession) return {};

  let judgeIsAssignedToSession = false;
  if (user.role === USER_ROLES.judge) {
    judgeIsAssignedToSession = sessionJudgeId == user.userId;
  } else if (user.role === USER_ROLES.chambers) {
    const sectionUsers = get(state.users);

    const judgeUser = sectionUsers.find(
      sectionUser => sectionUser.role === USER_ROLES.judge,
    );

    judgeIsAssignedToSession =
      judgeUser &&
      trialSession.judge &&
      trialSession.judge.userId === judgeUser.userId;
  }

  const showSwitchToSessionDetail =
    judgeIsAssignedToSession &&
    'TrialSessionWorkingCopy'.includes(get(state.currentPage));
  const showSwitchToWorkingCopy =
    judgeIsAssignedToSession &&
    'TrialSessionDetail'.includes(get(state.currentPage));

  const result = {
    assignedJudgeIsCurrentUser: judgeIsAssignedToSession,
    showSwitchToSessionDetail,
    showSwitchToWorkingCopy,
    title: 'Session Working Copy',
  };

  return result;
};
