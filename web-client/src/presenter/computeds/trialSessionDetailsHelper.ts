import { set30DayNoticeOfTrialReminder } from './utilities/set30DayNoticeOfTrialReminder';
import { state } from 'cerebral';

export const trialSessionDetailsHelper = (get, applicationContext) => {
  const { DOCKET_NUMBER_SUFFIXES, HYBRID_SESSION_TYPES } =
    applicationContext.getConstants();
  let showAlertForNOTTReminder: boolean = false;
  let alertMessageForNOTT: string | undefined = undefined;

  const {
    dismissedAlertForNOTT,
    eligibleCases,
    formattedStartDate,
    isCalendared,
    sessionType,
    startDate,
    trialSessionId,
  } = get(state.trialSession);
  const permissions = get(state.permissions);
  const canDismissThirtyDayAlert = permissions.DISMISS_30_DAY_ALERT;

  if (!dismissedAlertForNOTT && isCalendared && formattedStartDate) {
    const { isCurrentDateWithinReminderRange, thirtyDaysBeforeTrialFormatted } =
      set30DayNoticeOfTrialReminder({
        applicationContext,
        trialStartDate: formattedStartDate || startDate,
      });

    showAlertForNOTTReminder = isCurrentDateWithinReminderRange;
    alertMessageForNOTT = `30-day trial notices are due before ${thirtyDaysBeforeTrialFormatted}. Have notices been served?`;
  }

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

  return {
    alertMessageForNOTT,
    canDismissThirtyDayAlert,
    eligibleRegularCaseQcTotalCompleteCount,
    eligibleSmallCaseQcTotalCompleteCount,
    eligibleTotalCaseQcCompleteCount,
    showAlertForNOTTReminder,
    showQcComplete,
    showSetCalendarButton: permissions.SET_TRIAL_SESSION_CALENDAR,
    showSmallAndRegularQcComplete,
  };
};
