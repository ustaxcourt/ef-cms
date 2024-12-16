import { get } from '../requests';

export const generateTrialSessionMinutesPdfInteractor = (
  applicationContext,
  { docketNumber, trialSessionId },
) => {
  return get({
    applicationContext,
    endpoint: `/trial-sessions/${trialSessionId}/case/${docketNumber}/minutes`,
  });
};
