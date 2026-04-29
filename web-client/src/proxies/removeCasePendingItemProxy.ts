import { remove } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const removeCasePendingItemInteractor = (
  applicationContext: ClientApplicationContext,
  { docketEntryId, docketNumber },
): Promise<CaseDTO> => {
  return remove({
    applicationContext,
    endpoint: `/cases/${docketNumber}/remove-pending/${docketEntryId}`,
  });
};
