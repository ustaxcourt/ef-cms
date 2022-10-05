import {
  DOCKET_NUMBER_SUFFIXES,
  SESSION_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { state } from 'cerebral';

export const trialSessionDetailsHelper = get => {
  const { eligibleCases, sessionType, trialSessionId } = get(
    state.trialSession,
  );
  const permissions = get(state.permissions);

  console.log(get(state.trialSession));

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
    sessionType === SESSION_TYPES.hybrid && showQcComplete;

  return {
    eligibleRegularCaseQcTotalCompleteCount,
    eligibleSmallCaseQcTotalCompleteCount,
    eligibleTotalCaseQcCompleteCount,
    showQcComplete,
    showSetCalendarButton: permissions.SET_TRIAL_SESSION_CALENDAR,
    showSmallAndRegularQcComplete,
  };
};
