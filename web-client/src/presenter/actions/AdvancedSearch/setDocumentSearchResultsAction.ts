import { ADVANCED_SEARCH_TABS } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const setDocumentSearchResultsAction = ({
  get,
  props,
  store,
}: ActionProps<{
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
}>) => {
  const { sortColumn, sortDirection } = props;
  const advancedSearchTab = get(state.advancedSearchTab) as string;
  const STATE_KEY =
    advancedSearchTab === ADVANCED_SEARCH_TABS.OPINION
      ? 'opinionDocumentSearchSort'
      : 'orderDocumentSearchSort';

  store.set(state[STATE_KEY].sortColumn, sortColumn);
  store.set(state[STATE_KEY].sortDirection, sortDirection);
};
