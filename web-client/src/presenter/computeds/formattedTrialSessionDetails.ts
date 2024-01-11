import { ClientApplicationContext } from '@web-client/applicationContext';
import { FormattedTrialSessionDetailsType } from '@shared/business/utilities/getFormattedTrialSessionDetails';
import { Get } from 'cerebral';
import { isEmpty, isEqual } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

type FormatTrialSessionHelperType =
  | (FormattedTrialSessionDetailsType & {
      alertMessageForNOTT?: string;
      canClose?: boolean;
      canDelete?: boolean;
      canEdit?: boolean;
      chambersPhoneNumber?: string;
      disableHybridFilter?: boolean;
      isHybridSession?: boolean;
      showAlertForNOTTReminder?: boolean;
      showOnlyClosedCases?: boolean;
      showOpenCases?: boolean;
    })
  | undefined;

export const formattedTrialSessionDetails = (
  get: Get,
  applicationContext: ClientApplicationContext,
): FormatTrialSessionHelperType => {
  let canClose = false;
  let showOpenCases = false;
  let showOnlyClosedCases = false;
  let showAlertForNOTTReminder = false;
  let isHybridSession = false;
  let disableHybridFilter = false;
  let canDelete = false;
  let canEdit = false;

  let alertMessageForNOTT: string | undefined;
  let chambersPhoneNumber: string | undefined;

  const trialSession = get(state.trialSession);

  if (!trialSession) return;

  const formattedTrialSession = applicationContext
    .getUtilities()
    .getFormattedTrialSessionDetails({
      applicationContext,
      trialSession,
    });

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
