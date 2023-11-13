import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const trialSessionDetailsHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const { DOCKET_NUMBER_SUFFIXES, HYBRID_SESSION_TYPES } =
    applicationContext.getConstants();

  const { eligibleCases, hasNOTTBeenServed, sessionType, trialSessionId } = get(
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
    Object.values(HYBRID_SESSION_TYPES).includes(sessionType) && showQcComplete;

  const nottReminderAction = hasNOTTBeenServed
    ? 'Yes, Dismiss'
    : 'Serve/Dismiss';

  return {
    canDismissThirtyDayAlert: permissions.DISMISS_NOTT_REMINDER,
    eligibleRegularCaseQcTotalCompleteCount,
    eligibleSmallCaseQcTotalCompleteCount,
    eligibleTotalCaseQcCompleteCount,
    nottReminderAction,
    showQcComplete,
    showSetCalendarButton: permissions.SET_TRIAL_SESSION_CALENDAR,
    showSmallAndRegularQcComplete,
  };
};
