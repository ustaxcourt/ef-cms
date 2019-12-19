import { state } from 'cerebral';

export const formattedTrialSessionDetails = (get, applicationContext) => {
  const formattedTrialSession = applicationContext
    .getUtilities()
    .formattedTrialSessionDetails({
      applicationContext,
      trialSession: get(state.trialSession),
    });
  formattedTrialSession.canDelete = true;
  formattedTrialSession.canEdit = true;
  return formattedTrialSession;
};
