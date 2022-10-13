import { state } from 'cerebral';

export const trialSessionDetailsHelper = (get, applicationContext) => {
  const { DOCKET_NUMBER_SUFFIXES, TRIAL_SESSION_TYPES } =
    applicationContext.getConstants();

  const { eligibleCases, sessionType, trialSessionId } = get(
    state.trialSession,
  );
  const permissions = get(state.permissions);

  const eligibleTotalCaseQcCompleteCount = (eligibleCases || []).filter(
    eligibleCase => eligibleCase.qcCompleteForTrial?.[trialSessionId],
  ).length;

  const eligibleSmallCaseQcTotalCompleteCount = (eligibleCases || []).filter(
    eligibleCase =>
      eligibleCase.qcCompleteForTrial?.[trialSessionId] &&
      (eligibleCase.docketNumberSuffix === DOCKET_NUMBER_SUFFIXES.SMALL ||
        eligibleCase.docketNumberSuffix ===
          DOCKET_NUMBER_SUFFIXES.SMALL_LIEN_LEVY),
  ).length;

  const eligibleRegularCaseQcTotalCompleteCount = (eligibleCases || []).filter(
    eligibleCase =>
      eligibleCase.qcCompleteForTrial?.[trialSessionId] &&
      (eligibleCase.docketNumberSuffix === null ||
        (eligibleCase.docketNumberSuffix !== DOCKET_NUMBER_SUFFIXES.SMALL &&
          eligibleCase.docketNumberSuffix !==
            DOCKET_NUMBER_SUFFIXES.SMALL_LIEN_LEVY)),
  ).length;

  const showQcComplete = permissions.TRIAL_SESSION_QC_COMPLETE;
  const showSmallAndRegularQcComplete =
    sessionType === TRIAL_SESSION_TYPES.hybrid && showQcComplete;

  return {
    eligibleRegularCaseQcTotalCompleteCount,
    eligibleSmallCaseQcTotalCompleteCount,
    eligibleTotalCaseQcCompleteCount,
    showQcComplete,
    showSetCalendarButton: permissions.SET_TRIAL_SESSION_CALENDAR,
    showSmallAndRegularQcComplete,
  };
};
