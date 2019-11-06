import { state } from 'cerebral';

export const trialSessionHeaderHelper = get => {
  const trialSession = get(state.trialSession);
  if (!trialSession) return {};
  const judgeUser = get(state.judgeUser);
  const judgeIsAssignedToSession =
    judgeUser &&
    trialSession.judge &&
    trialSession.judge.userId === judgeUser.userId;

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
