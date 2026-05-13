import { PendingItem } from '@web-api/business/useCases/pendingItems/fetchPendingItemsInteractor';
import { get } from '../requests';
import qs from 'qs';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const fetchPendingItemsInteractor = (
  applicationContext: ClientApplicationContext,
  { judge, page = 0 },
): Promise<{
  foundDocuments: PendingItem[];
}> => {
  const queryString = qs.stringify({ judge, page });

  return get({
    applicationContext,
    endpoint: `/reports/pending-items?${queryString}`,
  });
};
