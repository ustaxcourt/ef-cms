import { state } from '@web-client/presenter/app.cerebral';

export const clearSearchResultsAction = ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const tabName = get(state.advancedSearchTab);
  const { ADVANCED_SEARCH_TABS } = applicationContext.getConstants();

  if (tabName) {
    store.unset(state.searchResults[tabName]);
  } else {
    store.unset(state.searchResults);
  }

  if (tabName === ADVANCED_SEARCH_TABS.CASE) {
    store.set(state.advancedSearchForm.currentPage, 1);
  }

  if (tabName === ADVANCED_SEARCH_TABS.ORDER) {
    store.set(state.orderDocumentSearchSort.sortColumn, 'formattedFiledDate');
    store.set(state.orderDocumentSearchSort.sortDirection, 'desc');
  } else if (tabName === ADVANCED_SEARCH_TABS.OPINION) {
    store.set(state.opinionDocumentSearchSort.sortColumn, 'formattedFiledDate');
    store.set(state.opinionDocumentSearchSort.sortDirection, 'desc');
  }
};
