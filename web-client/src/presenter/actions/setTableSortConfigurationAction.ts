import { state } from '@web-client/presenter/app.cerebral';

export const setTableSortConfigurationAction = ({
  props,
  store,
}: ActionProps<{
  sortField: string;
  sortOrder: 'asc' | 'desc';
  root?: string;
}>) => {
  const { root, sortField, sortOrder } = props;

  const ROOT = root || 'tableSort';
  store.set(state[ROOT].sortField, sortField);
  store.set(state[ROOT].sortOrder, sortOrder);
};
