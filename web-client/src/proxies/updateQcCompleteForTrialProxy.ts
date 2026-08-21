import { put } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const updateQcCompleteForTrialInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber, qcCompleteForTrial, trialSessionId },
): Promise<CaseDTO> => {
  return put({
    applicationContext,
    body: { qcCompleteForTrial, trialSessionId },
    endpoint: `/case-meta/${docketNumber}/qc-complete`,
  });
};
