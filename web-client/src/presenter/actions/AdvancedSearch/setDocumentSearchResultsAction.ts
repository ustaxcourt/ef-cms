import { state } from '@web-client/presenter/app.cerebral';

export const setDocumentSearchResultsAction = ({
  props,
  store,
}: ActionProps<{
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
}>) => {
  const { sortColumn, sortDirection } = props;

  const STATE_KEY = 'documentSearchSort';
  store.set(state[STATE_KEY].sortColumn, sortColumn);
  store.set(state[STATE_KEY].sortDirection, sortDirection);
};
