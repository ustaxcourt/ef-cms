import { parallel } from 'cerebral';
import { setClerkOfCourtDashboardChartsAction } from '@web-client/presenter/actions/Dashboard/setClerkOfCourtDashboardChartsAction';

// the dashboard view runs this after it renders, so route changes never wait for the stats requests;
// each tab has its own request, so the tabs load in parallel and render independently
export const loadClerkOfCourtDashboardChartsSequence = [
  parallel([
    setClerkOfCourtDashboardChartsAction('petitions'),
    setClerkOfCourtDashboardChartsAction('cases'),
  ]),
];
