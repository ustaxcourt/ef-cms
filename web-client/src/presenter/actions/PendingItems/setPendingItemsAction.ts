import { PendingItem } from '@web-api/business/useCases/pendingItems/fetchPendingItemsInteractor';
import { state } from '@web-client/presenter/app.cerebral';

export const setPendingItemsAction = ({
  props,
  store,
}: ActionProps<{ pendingItems: PendingItem[] }>) => {
  const { pendingItems } = props;
  store.set(state.pendingReports.pendingItems, pendingItems);
  store.set(state.pendingReports.hasPendingItemsResults, !!pendingItems.length);
  store.set(state.pendingReports.pendingItemsTotal, pendingItems.length);
};
