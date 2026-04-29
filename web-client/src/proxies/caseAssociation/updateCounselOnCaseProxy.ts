import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const updateCounselOnCaseInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber, userData, userId },
): Promise<CaseDTO> => {
  return put({
    applicationContext,
    body: { ...userData },
    endpoint: `/case-parties/${docketNumber}/counsel/${userId}`,
  });
};
