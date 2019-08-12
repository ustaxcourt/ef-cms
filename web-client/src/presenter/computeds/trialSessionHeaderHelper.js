import { state } from 'cerebral';

export const trialSessionHeaderHelper = (get, applicationContext) => {
  const trialSession = get(state.trialSession);
  const sessionJudgeId = get(state.trialSession.judge.userId);
  if (!trialSession) return {};

  const assignedJudgeIsCurrentUser =
    sessionJudgeId == applicationContext.getCurrentUser().userId;

  const showSwitchToSessionDetail =
    assignedJudgeIsCurrentUser &&
    'TrialSessionWorkingCopy'.includes(get(state.currentPage));
  const showSwitchToWorkingCopy =
    assignedJudgeIsCurrentUser &&
    'TrialSessionDetail'.includes(get(state.currentPage));

  const result = {
    assignedJudgeIsCurrentUser,
    showSwitchToSessionDetail,
    showSwitchToWorkingCopy,
    title: 'Session Working Copy',
  };

  return result;
};
