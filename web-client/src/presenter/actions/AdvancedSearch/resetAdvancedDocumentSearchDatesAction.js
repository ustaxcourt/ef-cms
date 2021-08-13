import { state } from 'cerebral';

export const resetAdvancedDocumentSearchDatesAction = async ({
  get,
  store,
}) => {
  const orderSearch = get(state.advancedSearchForm.orderSearch);
  if (orderSearch.dateRange === 'allDates') {
    store.unset(state.advancedSearchForm.orderSearch.startDate);
    store.unset(state.advancedSearchForm.orderSearch.endDate);
  }
};
