import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';
import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const removeCaseFromTrialInteractor = (
  applicationContext: ClientApplicationContext,
  {
    associatedJudge,
    associatedJudgeId,
    caseStatus,
    disposition,
    docketNumber,
    trialSessionId,
  },
): Promise<CaseDTO> => {
  return put({
    applicationContext,
    body: { associatedJudge, associatedJudgeId, caseStatus, disposition },
    endpoint: `/trial-sessions/${trialSessionId}/remove-case/${docketNumber}`,
  });
};
