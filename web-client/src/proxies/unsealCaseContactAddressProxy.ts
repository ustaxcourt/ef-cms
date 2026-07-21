import { put } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const unsealCaseContactAddressInteractor = (
  applicationContext: ClientApplicationContext,
  { contactId, docketNumber },
): Promise<CaseDTO> => {
  return put({
    applicationContext,
    endpoint: `/case-meta/${docketNumber}/unseal-address/${contactId}`,
  });
};
