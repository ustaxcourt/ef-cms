import { ClientApplicationContext } from '@web-client/applicationContext';
import { FormattedTrialSessionType } from '@shared/business/utilities/getFormattedTrialSessionDetails';
import { Get } from 'cerebral';
import { TrialSessionState } from '@web-client/presenter/state/trialSessionState';
import { isEmpty, isEqual } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

// TODO: type formatted trial sessions and refactor input and output of formattedTrialsession
export const formattedTrialSessionDetails = (
  get: Get,
  applicationContext: ClientApplicationContext,
): FormattedTrialSessionType & {
  canClose: boolean;
  showOnlyClosedCases: boolean;
  showAlertForNOTTReminder: boolean;
  showOpenCases: boolean;
  alertMessageForNOTT?: string;
  chambersPhoneNumber?: string;
  isHybridSession: boolean;
  disableHybridFilter: boolean;
  canDelete: boolean;
  canEdit: boolean;
} => {
  const formattedTrialSession = applicationContext
    .getUtilities()
    .getFormattedTrialSessionDetails({
      applicationContext,
      trialSession: get(state.trialSession),
    });

  let canClose = false;
  let showOpenCases = false;
  let showOnlyClosedCases = false;
  let showAlertForNOTTReminder = false;
  let isHybridSession = false;
  let disableHybridFilter = false;
  let canDelete = false;
  let canEdit = false;

  let alertMessageForNOTT: undefined | string;
  let chambersPhoneNumber: string | undefined;

  if (formattedTrialSession) {
    const {
      DATE_FORMATS,
      HYBRID_SESSION_TYPES,
      SESSION_STATUS_GROUPS,
      SESSION_STATUS_TYPES,
      TRIAL_SESSION_SCOPE_TYPES,
      USER_ROLES,
    } = applicationContext.getConstants();

    showOpenCases =
      formattedTrialSession.sessionStatus === SESSION_STATUS_GROUPS.open;
    showOnlyClosedCases =
      formattedTrialSession.sessionStatus === SESSION_STATUS_GROUPS.closed;

    showAlertForNOTTReminder =
      !formattedTrialSession.dismissedAlertForNOTT &&
      !!formattedTrialSession.isStartDateWithinNOTTReminderRange &&
      formattedTrialSession.sessionStatus !== SESSION_STATUS_TYPES.closed;

    if (showAlertForNOTTReminder) {
      alertMessageForNOTT = `30-day trial notices are due by ${formattedTrialSession.thirtyDaysBeforeTrialFormatted}. Have notices been served?`;
    }

    if (formattedTrialSession.chambersPhoneNumber) {
      chambersPhoneNumber = applicationContext
        .getUtilities()
        .formatPhoneNumber(formattedTrialSession.chambersPhoneNumber);
    }

    isHybridSession = Object.values(HYBRID_SESSION_TYPES).includes(
      formattedTrialSession.sessionType,
    );

    disableHybridFilter =
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

      canDelete = trialDateInFuture && !formattedTrialSession.isCalendared;
      canEdit =
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
        canClose = true;
      }
    }
  }

  return {
    ...formattedTrialSession,
    alertMessageForNOTT,
    canClose,
    canDelete,
    canEdit,
    chambersPhoneNumber,
    disableHybridFilter,
    isHybridSession,
    showAlertForNOTTReminder,
    showOnlyClosedCases,
    showOpenCases,
  };
};
