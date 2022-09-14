import { state } from 'cerebral';

export const getTrialSessionWorkingCopyRedirectUrlAction = ({ get }) => {
  const trialSessionId = get(state.formattedTrialSessionDetails.trialSessionId);
  console.log('We have the trial session id right?', trialSessionId);
  return { redirectUrl: `/trial-session-working-copy/${trialSessionId}` };
};
