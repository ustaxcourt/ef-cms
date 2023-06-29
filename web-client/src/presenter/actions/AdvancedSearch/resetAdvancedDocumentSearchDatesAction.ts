import { state } from '@web-client/presenter/app.cerebral';

export const resetAdvancedDocumentSearchDatesAction = ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const orderSearch = get(state.advancedSearchForm.orderSearch);
  if (
    orderSearch.dateRange ===
    applicationContext.getConstants().DATE_RANGE_SEARCH_OPTIONS.ALL_DATES
  ) {
    store.unset(state.advancedSearchForm.orderSearch.startDate);
    store.unset(state.advancedSearchForm.orderSearch.endDate);
  }
};
