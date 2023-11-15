import { PendingItem } from '@web-api/business/useCases/pendingItems/fetchPendingItemsInteractor';
import { get } from '../requests';
import qs from 'qs';

export const fetchPendingItemsInteractor = (
  applicationContext,
  { judge, page = 0 },
): Promise<{
  foundDocuments: PendingItem[];
  total: number;
}> => {
  const queryString = qs.stringify({ judge, page });

  return get({
    applicationContext,
    endpoint: `/reports/pending-items?${queryString}`,
  });
};
