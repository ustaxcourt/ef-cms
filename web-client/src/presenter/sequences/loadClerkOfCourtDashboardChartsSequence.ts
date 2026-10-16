import { setClerkOfCourtDashboardChartsAction } from '@web-client/presenter/actions/Dashboard/setClerkOfCourtDashboardChartsAction';

// the dashboard view runs this after it renders, so route changes never wait for the stats request
export const loadClerkOfCourtDashboardChartsSequence = [
  setClerkOfCourtDashboardChartsAction,
];
