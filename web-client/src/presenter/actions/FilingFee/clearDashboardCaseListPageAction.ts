import { state } from '@web-client/presenter/app.cerebral';

export const clearDashboardCaseListPageAction = ({
  store,
}: ActionProps): void => {
  store.unset(state.dashboardCaseListPageIndex);
};
