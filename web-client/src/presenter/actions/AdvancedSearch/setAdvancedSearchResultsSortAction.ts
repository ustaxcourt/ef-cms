import {
  ADVANCED_SEARCH_TABS,
  ASCENDING,
  DESCENDING,
} from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const setAdvancedSearchResultsSortAction = ({
  get,
  props,
  store,
}: ActionProps<{
  sortColumn: string;
  sortDirection: typeof ASCENDING | typeof DESCENDING;
}>) => {
  const { sortColumn, sortDirection } = props;
  const advancedSearchTab = get(state.advancedSearchTab) as string;
  let stateKey;

  if (advancedSearchTab === ADVANCED_SEARCH_TABS.CASE) {
    store.set(state.caseSearchSort.sortColumn, sortColumn);
    store.set(state.caseSearchSort.sortDirection, sortDirection);
    return;
  } else if (advancedSearchTab === ADVANCED_SEARCH_TABS.ORDER) {
    stateKey = 'orderDocumentSearchSort';
  } else if (advancedSearchTab === ADVANCED_SEARCH_TABS.OPINION) {
    stateKey = 'opinionDocumentSearchSort';
  } else {
    return;
  }

  store.set(state[stateKey].sortColumn, sortColumn);
  store.set(state[stateKey].sortDirection, sortDirection);
};
