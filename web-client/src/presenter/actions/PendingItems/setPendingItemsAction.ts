import { PendingItem } from '@web-api/business/useCases/pendingItems/fetchPendingItemsInteractor';
import { state } from '@web-client/presenter/app.cerebral';

export const setPendingItemsAction = ({
  get,
  props,
  store,
}: ActionProps<{ pendingItems: PendingItem[]; total: number }>) => {
  const pendingItems = get(state.pendingReports.pendingItems);
  store.set(state.pendingReports.pendingItems, [
    ...pendingItems,
    ...props.pendingItems,
  ]);
  store.set(state.pendingReports.hasPendingItemsResults, true);
  store.set(state.pendingReports.pendingItemsTotal, props.total);
};
