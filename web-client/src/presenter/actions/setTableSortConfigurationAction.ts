import { state } from '@web-client/presenter/app.cerebral';

export const setTableSortConfigurationAction = ({
  props,
  store,
}: ActionProps<{
  sortField: string;
  sortOrder: 'asc' | 'desc';
}>) => {
  store.set(state.tableSort.sortField, props.sortField);
  store.set(state.tableSort.sortOrder, props.sortOrder);
};
