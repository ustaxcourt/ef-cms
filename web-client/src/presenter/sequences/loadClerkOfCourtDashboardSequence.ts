import { fetchUserNotificationsSequence } from '@web-client/presenter/sequences/fetchUserNotificationsSequence';
import { parallel } from 'cerebral';
import { setClerkOfCourtDashboardChartsAction } from '@web-client/presenter/actions/Dashboard/setClerkOfCourtDashboardChartsAction';
import { setClerkOfCourtDashboardMessagesAction } from '@web-client/presenter/actions/Dashboard/setClerkOfCourtDashboardMessagesAction';
import { setClerkOfCourtDashboardTrialSessionsAction } from '@web-client/presenter/actions/Dashboard/setClerkOfCourtDashboardTrialSessionsAction';

// the dashboard view runs this after it renders, so the page and route changes never wait for
// these requests; each section has its own request and status, so the sections render independently
export const loadClerkOfCourtDashboardSequence = [
  parallel([
    fetchUserNotificationsSequence,
    setClerkOfCourtDashboardTrialSessionsAction,
    setClerkOfCourtDashboardMessagesAction,
    setClerkOfCourtDashboardChartsAction('petitions'),
    setClerkOfCourtDashboardChartsAction('cases'),
  ]),
];
