import { put } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const updateCaseContextInteractor = (
  applicationContext: ClientApplicationContext,
  { caseCaption, caseStatus, docketNumber, judgeData },
): Promise<CaseDTO> => {
  return put({
    applicationContext,
    body: { caseCaption, caseStatus, judgeData },
    endpoint: `/case-meta/${docketNumber}/case-context`,
  });
};
