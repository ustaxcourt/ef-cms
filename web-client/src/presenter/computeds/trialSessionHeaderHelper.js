import { state } from 'cerebral';

export const trialSessionHeaderHelper = (get, applicationContext) => {
  const currentUser = applicationContext.getCurrentUser();
  const { USER_ROLES } = applicationContext.getConstants();

  const trialSession = get(state.trialSession);
  if (!trialSession) return {};
  const judgeUser = get(state.judgeUser);
  const isTrialClerk = currentUser.role === USER_ROLES.trialClerk;

  const isJudgeAssignedToSession =
    judgeUser && trialSession.judge?.userId === judgeUser.userId;

  const isTrialClerkAssignedToSession =
    isTrialClerk && trialSession.trialClerk?.userId === currentUser.userId;

  const formattedTrialSession = applicationContext
    .getUtilities()
    .formattedTrialSessionDetails({
      applicationContext,
      trialSession: get(state.trialSession),
    });

  let nameToDisplay = formattedTrialSession.formattedJudge;

  if (isTrialClerk) {
    nameToDisplay = currentUser.name;
  }

  const isAssigned = isJudgeAssignedToSession || isTrialClerkAssignedToSession;

  const showSwitchToSessionDetail =
    isAssigned && 'TrialSessionWorkingCopy'.includes(get(state.currentPage));
  const showSwitchToWorkingCopy =
    isAssigned && 'TrialSessionDetail'.includes(get(state.currentPage));

  return {
    nameToDisplay,
    showSwitchToSessionDetail,
    showSwitchToWorkingCopy,
    title: 'Session Working Copy',
  };
};
