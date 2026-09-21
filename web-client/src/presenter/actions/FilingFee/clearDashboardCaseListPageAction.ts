import { state } from '@web-client/presenter/app.cerebral';

export const clearDashboardCaseListPageAction = ({ store }: ActionProps) => {
  store.unset(state.dashboardCaseListPageIndex);
};
