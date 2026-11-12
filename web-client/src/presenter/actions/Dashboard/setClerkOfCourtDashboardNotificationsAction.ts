import { getNotificationsAction } from '@web-client/presenter/actions/getNotificationsAction';
import { state } from '@web-client/presenter/app.cerebral';

// each load gets a number, so a response from an older load cannot overwrite a newer one
let latestRequestId = 0;

/**
 * Loads the user's notifications after the clerk of court dashboard renders.
 * The request runs in the background, so a failure must not go to the global
 * error handler: that would replace the dashboard, or a page the user opened
 * since, with the error page. Instead, a failure keeps the current notification
 * counts and shows an alert on the dashboard.
 */
export const setClerkOfCourtDashboardNotificationsAction = async (
  props: ActionProps,
): Promise<void> => {
  const { get, store } = props;
  const requestId = ++latestRequestId;
  // other pages load their own notifications and show their own alerts, so do nothing after the user leaves
  const isLatestLoadOnDashboard = (): boolean =>
    requestId === latestRequestId &&
    get(state.currentPage) === 'DashboardClerkOfCourt';

  try {
    const { notifications } = await getNotificationsAction(props);

    if (!isLatestLoadOnDashboard()) return;
    store.set(state.notifications, notifications);
  } catch (e) {
    console.error('setClerkOfCourtDashboardNotificationsAction failed:', e);
    if (!isLatestLoadOnDashboard()) return;
    store.set(state.alertError, {
      message:
        'Your notification counts may be out of date. Please refresh the page.',
      title: 'Notifications could not be loaded',
    });
  }
};
