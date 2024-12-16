import { post } from '../requests';

export const generateTrialSessionMinutesPdfInteractor = (
  applicationContext,
  { docketNumber, formattedMinutesSheet, trialSessionId },
) => {
  return post({
    applicationContext,
    body: { formattedMinutesSheet },
    endpoint: `/trial-sessions/${trialSessionId}/case/${docketNumber}/minutes`,
  });
};
