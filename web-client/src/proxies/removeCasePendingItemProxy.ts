import { remove } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const removeCasePendingItemInteractor = (
  applicationContext: ClientApplicationContext,
  { docketEntryId, docketNumber },
) => {
  return remove({
    applicationContext,
    endpoint: `/cases/${docketNumber}/remove-pending/${docketEntryId}`,
  });
};
