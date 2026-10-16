import { state } from '@web-client/presenter/app.cerebral';
import { getActivePageIndexFromOneBasedPageQuery } from '@web-client/utilities/useClientSidePaginator';

export const setFilingFeeReturnPageAction = ({
  props,
  store,
}: ActionProps<{ page?: string }>): void => {
  const pageIndex = getActivePageIndexFromOneBasedPageQuery(props.page);

  if (pageIndex > 0) {
    store.set(state.dashboardCaseListPageIndex, pageIndex);
  } else {
    store.unset(state.dashboardCaseListPageIndex);
  }
};
