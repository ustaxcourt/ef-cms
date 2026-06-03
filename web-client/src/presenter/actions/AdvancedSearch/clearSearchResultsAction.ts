import { ADVANCED_SEARCH_TABS } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const clearSearchResultsAction = ({ get, store }: ActionProps) => {
  const tabName = get(state.advancedSearchTab);

  if (tabName) {
    store.unset(state.searchResults[tabName]);
  } else {
    store.unset(state.searchResults);
  }

  store.set(state.advancedSearchForm.currentPage, 1);

  if (tabName === ADVANCED_SEARCH_TABS.CASE) {
    store.unset(state.caseSearchSort.sortColumn);
    store.unset(state.caseSearchSort.sortDirection);
  } else if (tabName === ADVANCED_SEARCH_TABS.ORDER) {
    store.set(state.orderDocumentSearchSort.sortColumn, 'formattedFiledDate');
    store.set(state.orderDocumentSearchSort.sortDirection, 'desc');
  } else if (tabName === ADVANCED_SEARCH_TABS.OPINION) {
    store.set(state.opinionDocumentSearchSort.sortColumn, 'formattedFiledDate');
    store.set(state.opinionDocumentSearchSort.sortDirection, 'desc');
  }
};
