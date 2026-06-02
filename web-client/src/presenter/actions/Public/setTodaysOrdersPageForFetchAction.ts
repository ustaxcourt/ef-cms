import { state } from '@web-client/presenter/app-public.cerebral';

export const setTodaysOrdersPageForFetchAction = ({
  props,
  store,
}: ActionProps<{ currentPaginationPage: number }>) => {
  const page = props.currentPaginationPage + 1;
  store.set(state.todaysOrders.page, page);
};
