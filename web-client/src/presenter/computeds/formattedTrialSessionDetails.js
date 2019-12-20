import { state } from 'cerebral';

export const formattedTrialSessionDetails = (get, applicationContext) => {
  const formattedTrialSession = applicationContext
    .getUtilities()
    .formattedTrialSessionDetails({
      applicationContext,
      trialSession: get(state.trialSession),
    });

  if (formattedTrialSession && formattedTrialSession.startDate) {
    const trialDateFormatted = applicationContext
      .getUtilities()
      .formatDateString(formattedTrialSession.startDate, 'YYYYMMDD');
    const nowDateFormatted = applicationContext
      .getUtilities()
      .formatNow('YYYYMMDD');
    const trialDateInFuture = trialDateFormatted > nowDateFormatted;
    formattedTrialSession.canDelete = trialDateInFuture;
    formattedTrialSession.canEdit = trialDateInFuture;
  }

  return formattedTrialSession;
};
