import { post } from '../requests';

export const generateTrialSessionMinutesPdfInteractor = (
  applicationContext,
  { docketNumber, trialSessionId },
) => {
  return post({
    applicationContext,
    endpoint: `/trial-sessions/${trialSessionId}/case/${docketNumber}/minutes`,
  });
};
