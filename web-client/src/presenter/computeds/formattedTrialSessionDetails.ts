import { ClientApplicationContext } from '@web-client/applicationContext';
import { FormattedTrialSessionDetailsType } from '@shared/business/utilities/trialSession/getFormattedTrialSessionDetails';
import { Get } from 'cerebral';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { isEmpty, isEqual } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';
import { thirtyDaysBeforeTrial } from '@web-client/presenter/computeds/trialSessionsHelper';
import {
  ROLES,
  SESSION_STATUS_GROUPS,
  SESSION_TYPES,
} from '@shared/business/entities/EntityConstants';

type EditPermissionsType = 'all' | 'limited' | 'none';

const getTrialSessionEditPermissions = ({
  trialDateInFuture,
  trialSession,
  userRole,
}: {
  trialDateInFuture: boolean;
  trialSession: Pick<
    FormattedTrialSessionDetailsType,
    'isCalendared' | 'isReportingSession' | 'sessionStatus' | 'sessionType'
  >;
  userRole: string;
}): EditPermissionsType => {
  if (userRole === ROLES.caseServicesSupervisor && !trialDateInFuture) {
    return trialSession.isCalendared ? 'limited' : 'none';
  }

  const readOnlyRoles: string[] = [ROLES.chambers, ROLES.judge];
  if (
    !trialDateInFuture ||
    trialSession.sessionStatus === SESSION_STATUS_GROUPS.closed ||
    readOnlyRoles.includes(userRole)
  ) {
    return 'none';
  }

  const docketClerkSessionTypes: string[] = [
    SESSION_TYPES.special,
    SESSION_TYPES.motionHearing,
  ];
  if (
    userRole === ROLES.docketClerk &&
    !trialSession.isReportingSession &&
    !docketClerkSessionTypes.includes(trialSession.sessionType)
  ) {
    return 'none';
  }

  return 'all';
};

export type FormatTrialSessionHelperType = FormattedTrialSessionDetailsType & {
  alertMessageForNOTT?: string;
  canClose?: boolean;
  canDelete?: boolean;
  editPermissions?: EditPermissionsType;
  chambersPhoneNumber?: string;
  disableHybridFilter?: boolean;
  isHybridSession?: boolean;
  isRemoteSession: boolean;
  showAlertForNOTTReminder?: boolean;
  showOnlyClosedCases?: boolean;
  showOpenCases?: boolean;
};

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
  let editPermissions: EditPermissionsType = 'none';

  let alertMessageForNOTT: string | undefined;
  let chambersPhoneNumber: string | undefined;

  const trialSession = get(state.trialSession);
  if (!trialSession.trialSessionId) return {} as FormatTrialSessionHelperType;
  const currentUser = get(state.user);
  const formattedTrialSession = applicationContext
    .getUtilities()
    .getFormattedTrialSessionDetails({
      applicationContext,
      currentUser,
      trialSession,
    });
  const {
    DATE_FORMATS,
    HYBRID_SESSION_TYPES,
    SESSION_STATUS_GROUPS,
    SESSION_STATUS_TYPES,
    TRIAL_SESSION_SCOPE_TYPES,
  } = applicationContext.getConstants();

  showOpenCases =
    formattedTrialSession.sessionStatus === SESSION_STATUS_GROUPS.open;
  showOnlyClosedCases =
    formattedTrialSession.sessionStatus === SESSION_STATUS_GROUPS.closed;

  showAlertForNOTTReminder =
    !formattedTrialSession.dismissedAlertForNott &&
    TrialSession.isStartDateWithinNOTTReminderRange({
      isCalendared: formattedTrialSession.isCalendared,
      startDate: formattedTrialSession.startDate,
    }) &&
    formattedTrialSession.sessionStatus !== SESSION_STATUS_TYPES.closed;

  if (showAlertForNOTTReminder) {
    alertMessageForNOTT = `30-day trial notices are due by ${thirtyDaysBeforeTrial(formattedTrialSession.startDate)}. Have notices been served?`;
  }

  if (formattedTrialSession.chambersPhoneNumber) {
    chambersPhoneNumber = applicationContext
      .getUtilities()
      .formatPhoneNumber(formattedTrialSession.chambersPhoneNumber);
  }

  const HYBRID_SESSION_TYPES_ARRAY: string[] =
    Object.values(HYBRID_SESSION_TYPES);

  isHybridSession = HYBRID_SESSION_TYPES_ARRAY.includes(
    formattedTrialSession.sessionType,
  );

  disableHybridFilter =
    (formattedTrialSession.eligibleCases ?? []).length === 0;

  if (formattedTrialSession.startDate) {
    const trialDateFormatted = applicationContext
      .getUtilities()
      .formatDateString(formattedTrialSession.startDate, DATE_FORMATS.YYYYMMDD);
    const nowDateFormatted = applicationContext
      .getUtilities()
      .formatNow(DATE_FORMATS.YYYYMMDD);

    const trialDateInFuture = trialDateFormatted > nowDateFormatted;

    canDelete = trialDateInFuture && !formattedTrialSession.isCalendared;
    editPermissions = getTrialSessionEditPermissions({
      trialDateInFuture,
      trialSession: formattedTrialSession,
      userRole: currentUser.role,
    });

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
    editPermissions,
    chambersPhoneNumber,
    disableHybridFilter,
    isHybridSession,
    showAlertForNOTTReminder,
    showOnlyClosedCases,
    showOpenCases,
  };
};
