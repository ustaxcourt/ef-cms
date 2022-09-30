import { DOCKET_NUMBER_SUFFIXES } from '../../../../shared/src/business/entities/EntityConstants';
import { state } from 'cerebral';

export const trialSessionDetailsHelper = get => {
  const { eligibleCases, trialSessionId } = get(state.trialSession);
  const permissions = get(state.permissions);

  const eligibleTotalCaseQcCompleteCount = (eligibleCases || []).filter(
    eligibleCase =>
      eligibleCase.qcCompleteForTrial &&
      eligibleCase.qcCompleteForTrial[trialSessionId],
  ).length;
  const eligibleSmallCaseQcTotalCompleteCount = (eligibleCases || []).filter(
    eligibleCase =>
      eligibleCase.qcCompleteForTrial &&
      eligibleCase.qcCompleteForTrial[trialSessionId] &&
      (eligibleCase.docketNumberSuffix === DOCKET_NUMBER_SUFFIXES.SMALL ||
        eligibleCase.docketNumberSuffix ===
          DOCKET_NUMBER_SUFFIXES.SMALL_LIEN_LEVY),
  ).length;
  const eligibleRegularCaseQcTotalCompleteCount = (eligibleCases || []).filter(
    eligibleCase =>
      eligibleCase.qcCompleteForTrial &&
      eligibleCase.qcCompleteForTrial[trialSessionId] &&
      (eligibleCase.docketNumberSuffix === null ||
        (eligibleCase.docketNumberSuffix !== DOCKET_NUMBER_SUFFIXES.SMALL &&
          eligibleCase.docketNumberSuffix !==
            DOCKET_NUMBER_SUFFIXES.SMALL_LIEN_LEVY)),
  ).length;
  const showQcComplete = permissions.TRIAL_SESSION_QC_COMPLETE;

  return {
    eligibleRegularCaseQcTotalCompleteCount,
    eligibleSmallCaseQcTotalCompleteCount,
    eligibleTotalCaseQcCompleteCount,
    showQcComplete,
    showSetCalendarButton: permissions.SET_TRIAL_SESSION_CALENDAR,
  };
};
