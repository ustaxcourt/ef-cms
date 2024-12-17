import { post } from '../requests';

export const generateTrialSessionMinutesPdfInteractor = (
  applicationContext,
  { docketNumber, formattedMinuteSheet, trialSessionId },
) => {
  return post({
    applicationContext,
    body: { formattedMinuteSheet },
    endpoint: `/trial-sessions/${trialSessionId}/case/${docketNumber}/minutes`,
  });
};
