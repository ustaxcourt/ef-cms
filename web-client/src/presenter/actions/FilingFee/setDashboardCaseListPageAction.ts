import { state } from '@web-client/presenter/app.cerebral';

export const setDashboardCaseListPageAction = ({
  props,
  store,
}: ActionProps<{ dashboardCaseListPageIndex: number }>) => {
  store.set(state.dashboardCaseListPageIndex, props.dashboardCaseListPageIndex);
};
