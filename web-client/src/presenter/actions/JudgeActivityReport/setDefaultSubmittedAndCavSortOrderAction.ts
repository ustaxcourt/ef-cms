import { state } from '@web-client/presenter/app.cerebral';

export const setDefaultSubmittedAndCavSortOrderAction = ({
  applicationContext,
  store,
}: ActionProps) => {
  store.set(state.tableSort.sortField, 'daysElapsedSinceLastStatusChange');
  store.set(
    state.tableSort.sortOrder,
    applicationContext.getConstants().DESCENDING,
  );
};
