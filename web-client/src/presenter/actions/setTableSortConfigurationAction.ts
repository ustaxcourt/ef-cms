import { state } from '@web-client/presenter/app.cerebral';

export const setTableSortConfigurationAction = ({
  props,
  store,
}: ActionProps<{
  sortField: string;
  sortOrder: 'asc' | 'desc';
  stateKey?: string;
}>) => {
  const { sortField, sortOrder, stateKey } = props;

  const STATE_KEY = stateKey || 'tableSort';
  store.set(state[STATE_KEY].sortField, sortField);
  store.set(state[STATE_KEY].sortOrder, sortOrder);
};
