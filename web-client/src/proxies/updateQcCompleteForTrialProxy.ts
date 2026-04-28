import { put } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const updateQcCompleteForTrialInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber, qcCompleteForTrial, trialSessionId },
): Promise<RawCase> => {
  return put({
    applicationContext,
    body: { qcCompleteForTrial, trialSessionId },
    endpoint: `/case-meta/${docketNumber}/qc-complete`,
  });
};
