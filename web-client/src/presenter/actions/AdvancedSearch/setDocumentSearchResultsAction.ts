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
  let stateKey;

  if (advancedSearchTab === ADVANCED_SEARCH_TABS.CASE) {
    stateKey = 'caseSearchSort';
  } else if (advancedSearchTab === ADVANCED_SEARCH_TABS.ORDER) {
    stateKey = 'orderDocumentSearchSort';
  } else if (advancedSearchTab === ADVANCED_SEARCH_TABS.OPINION) {
    stateKey = 'opinionDocumentSearchSort';
  } else {
    stateKey = 'caseSearchSort';
  }

  store.set(state[stateKey].sortColumn, sortColumn);
  store.set(state[stateKey].sortDirection, sortDirection);
};
