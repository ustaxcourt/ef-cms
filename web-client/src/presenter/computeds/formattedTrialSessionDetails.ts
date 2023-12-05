import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { isEmpty, isEqual } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const formattedTrialSessionDetails = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const formattedTrialSession = applicationContext
    .getUtilities()
    .getFormattedTrialSessionDetails({
      applicationContext,
      trialSession: get(state.trialSession),
    });

  if (formattedTrialSession) {
    const {
      DATE_FORMATS,
      HYBRID_SESSION_TYPES,
      SESSION_STATUS_GROUPS,
      SESSION_STATUS_TYPES,
      TRIAL_SESSION_SCOPE_TYPES,
      USER_ROLES,
    } = applicationContext.getConstants();

    formattedTrialSession.showOpenCases =
      formattedTrialSession.sessionStatus === SESSION_STATUS_GROUPS.open;
    formattedTrialSession.showOnlyClosedCases =
      formattedTrialSession.sessionStatus === SESSION_STATUS_GROUPS.closed;

    formattedTrialSession.showAlertForNOTTReminder =
      !formattedTrialSession.dismissedAlertForNOTT &&
      !!formattedTrialSession.isStartDateWithinNOTTReminderRange &&
      formattedTrialSession.sessionStatus !== SESSION_STATUS_TYPES.closed;

    if (formattedTrialSession.showAlertForNOTTReminder) {
      formattedTrialSession.alertMessageForNOTT = `30-day trial notices are due by ${formattedTrialSession.thirtyDaysBeforeTrialFormatted}. Have notices been served?`;
    }

    if (formattedTrialSession.chambersPhoneNumber) {
      formattedTrialSession.chambersPhoneNumber = applicationContext
        .getUtilities()
        .formatPhoneNumber(formattedTrialSession.chambersPhoneNumber);
    }

    formattedTrialSession.isHybridSession = Object.values(
      HYBRID_SESSION_TYPES,
    ).includes(formattedTrialSession.sessionType);

    formattedTrialSession.disableHybridFilter =
      (formattedTrialSession.eligibleCases ?? []).length === 0;

    if (formattedTrialSession.startDate) {
      const trialDateFormatted = applicationContext
        .getUtilities()
        .formatDateString(formattedTrialSession.startDate);
      const nowDateFormatted = applicationContext
        .getUtilities()
        .formatNow(DATE_FORMATS.YYYYMMDD);

      const user = applicationContext.getCurrentUser();
      const isChambersUser = user.role === USER_ROLES.chambers;

      const trialDateInFuture = trialDateFormatted > nowDateFormatted;
      formattedTrialSession.canDelete =
        trialDateInFuture && !formattedTrialSession.isCalendared;
      formattedTrialSession.canEdit =
        trialDateInFuture &&
        formattedTrialSession.sessionStatus !== SESSION_STATUS_GROUPS.closed &&
        !isChambersUser;

      const allCases = formattedTrialSession.caseOrder || [];
      const inactiveCases = allCases.filter(
        sessionCase => sessionCase.removedFromTrial === true,
      );
      const hasNoActiveCases =
        isEmpty(allCases) || isEqual(allCases, inactiveCases);

      if (
        hasNoActiveCases &&
        !trialDateInFuture &&
        formattedTrialSession.sessionScope ===
          TRIAL_SESSION_SCOPE_TYPES.standaloneRemote &&
        formattedTrialSession.sessionStatus !== SESSION_STATUS_TYPES.closed
      ) {
        formattedTrialSession.canClose = true;
      }
    }
  }

  return formattedTrialSession;
};
