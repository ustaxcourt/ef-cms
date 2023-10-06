import { state } from '@web-client/presenter/app.cerebral';

export const setTableSortConfigurationAction = ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps<{
  sortField: string;
}>) => {
  const { sortField } = props;

  const { ASCENDING, DESCENDING } = applicationContext.getConstants();

  const fromSortOrder = get(state.tableSort.sortOrder);

  if (get(state.tableSort.sortField) !== sortField) {
    store.set(state.tableSort.sortOrder, DESCENDING);
  } else {
    const newSortOrder = fromSortOrder === DESCENDING ? ASCENDING : DESCENDING;
    store.set(state.tableSort.sortOrder, newSortOrder);
  }
  store.set(state.tableSort.sortField, sortField);
};
