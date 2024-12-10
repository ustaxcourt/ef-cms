import { PendingItem } from '@web-api/business/useCases/pendingItems/fetchPendingItemsInteractor';
import { state } from '@web-client/presenter/app.cerebral';

export const setPendingItemsAction = ({
  applicationContext,

  props,
  store,
}: ActionProps<{ pendingItems: PendingItem[] }>) => {
  const { pendingItems } = props;
  const formattedPendingItems = pendingItems.map(item =>
    applicationContext
      .getUtilities()
      .formatPendingItem(item, { applicationContext }),
  );

  store.set(state.pendingReports.pendingItems, formattedPendingItems);
  store.set(
    state.pendingReports.hasPendingItemsResults,
    !!formattedPendingItems.length,
  );
  store.set(
    state.pendingReports.pendingItemsTotal,
    formattedPendingItems.length,
  );
};
