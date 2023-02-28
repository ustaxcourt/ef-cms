import { state } from 'cerebral';

export const resetAdvancedDocumentSearchDatesAction = ({
  applicationContext,
  get,
  store,
}) => {
  const orderSearch = get(state.advancedSearchForm.orderSearch);
  if (
    orderSearch.dateRange ===
    applicationContext.getConstants().DATE_RANGE_SEARCH_OPTIONS.ALL_DATES
  ) {
    store.unset(state.advancedSearchForm.orderSearch.startDate);
    store.unset(state.advancedSearchForm.orderSearch.endDate);
  }
};
