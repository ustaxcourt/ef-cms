import { state } from 'cerebral';

export const formattedTrialSessionDetails = (get, applicationContext) => {
  const formattedTrialSession = applicationContext
    .getUtilities()
    .formattedTrialSessionDetails({
      applicationContext,
      trialSession: get(state.trialSession),
    });

  const { SESSION_SORT_STATUS_TYPES } = applicationContext.getConstants();

  if (formattedTrialSession) {
    formattedTrialSession.showOpenCases =
      formattedTrialSession.computedStatus === SESSION_SORT_STATUS_TYPES.open;
    formattedTrialSession.showOnlyClosedCases =
      formattedTrialSession.computedStatus === SESSION_SORT_STATUS_TYPES.closed;

    if (formattedTrialSession.startDate) {
      const trialDateFormatted = applicationContext
        .getUtilities()
        .formatDateString(formattedTrialSession.startDate, 'YYYYMMDD');
      const nowDateFormatted = applicationContext
        .getUtilities()
        .formatNow('YYYYMMDD');
      const trialDateInFuture = trialDateFormatted > nowDateFormatted;
      formattedTrialSession.canDelete =
        trialDateInFuture && !formattedTrialSession.isCalendared;
      formattedTrialSession.canEdit = trialDateInFuture;
    }
  }

  return formattedTrialSession;
};
