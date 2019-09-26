import { state } from 'cerebral';

export const formattedTrialSessionDetails = (get, applicationContext) => {
  return applicationContext.getUtilities().formattedTrialSessionDetails({
    applicationContext,
    trialSession: get(state.trialSession),
  });
};
