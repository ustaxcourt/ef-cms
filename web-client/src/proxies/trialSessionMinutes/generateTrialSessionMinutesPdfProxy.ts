import { applicationContext } from '@web-client/applicationContext';
import { post } from '../requests';

export const generateTrialSessionMinutesPdfInteractor = ({
  docketNumber,
  trialSessionId,
}) => {
  return post({
    applicationContext,
    endpoint: `/trial-sessions/${trialSessionId}/case/${docketNumber}/minutes`,
  });
};
