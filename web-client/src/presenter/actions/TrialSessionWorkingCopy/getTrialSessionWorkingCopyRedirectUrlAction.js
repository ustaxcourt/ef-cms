import { state } from 'cerebral';

export const getTrialSessionWorkingCopyRedirectUrlAction = ({ get }) => {
  const trialSessionId = get(state.formattedTrialSessionDetails.trialSessionId);
  return { redirectUrl: `/trial-session-working-copy/${trialSessionId}` };
};
