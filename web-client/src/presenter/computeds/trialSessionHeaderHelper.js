import { isEmpty } from 'lodash';
import { state } from 'cerebral';

export const trialSessionHeaderHelper = (get, applicationContext) => {
  const { USER_ROLES } = applicationContext.getConstants();

  const currentUser = applicationContext.getCurrentUser();

  const trialSession = get(state.trialSession);
  const judgeUser = get(state.judgeUser);

  if (!trialSession) return {};

  const formattedTrialSession = applicationContext
    .getUtilities()
    .formattedTrialSessionDetails({
      applicationContext,
      trialSession: get(state.trialSession),
    });

  const isTrialClerk = currentUser.role === USER_ROLES.trialClerk;
  const isJudgeAssignedToSession =
    judgeUser && trialSession.judge?.userId === judgeUser.userId;
  const isTrialClerkAssignedToSession =
    isTrialClerk && trialSession.trialClerk?.userId === currentUser.userId;
  const isAssigned = isJudgeAssignedToSession || isTrialClerkAssignedToSession;

  const showSwitchToSessionDetail =
    isAssigned && 'TrialSessionWorkingCopy'.includes(get(state.currentPage));
  const showSwitchToWorkingCopy =
    isAssigned && 'TrialSessionDetail'.includes(get(state.currentPage));

  return {
    isStandaloneSession: applicationContext
      .getUtilities()
      .isStandaloneRemoteSession(formattedTrialSession.sessionScope),
    nameToDisplay: isTrialClerk
      ? currentUser.name
      : formattedTrialSession.formattedJudge,
    showBatchDownloadButton: !isEmpty(formattedTrialSession.allCases),
    showSwitchToSessionDetail,
    showSwitchToWorkingCopy,
    title: 'Session Working Copy',
  };
};
