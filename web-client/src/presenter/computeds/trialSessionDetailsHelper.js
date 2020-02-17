import { state } from 'cerebral';

export const trialSessionDetailsHelper = get => {
  const { eligibleCases, trialSessionId } = get(state.trialSession);
  const permissions = get(state.permissions);

  const eligibleCaseQcCompleteCount = (eligibleCases || []).filter(
    eligibleCase =>
      eligibleCase.qcCompleteForTrial &&
      eligibleCase.qcCompleteForTrial[trialSessionId],
  ).length;
  const showQcComplete = permissions.TRIAL_SESSION_QC_COMPLETE;

  return {
    eligibleCaseQcCompleteCount,
    showQcComplete,
    showSetCalendarButton: permissions.SET_TRIAL_SESSION_CALENDAR,
  };
};
