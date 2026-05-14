import { put } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const saveCaseDetailInternalEditInteractor = (
  applicationContext: ClientApplicationContext,
  { caseToUpdate },
): Promise<CaseDTO> => {
  return put({
    applicationContext,
    body: caseToUpdate,
    endpoint: `/cases/${caseToUpdate.docketNumber}`,
  });
};
