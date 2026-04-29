import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const batchDownloadTrialSessionInteractor = (
  applicationContext: ClientApplicationContext,
  { trialSessionId, clientConnectionId },
): Promise<void> => {
  return get({
    applicationContext,
    params: { clientConnectionId },
    endpoint: `/async/trial-sessions/${trialSessionId}/batch-download`,
  });
};
