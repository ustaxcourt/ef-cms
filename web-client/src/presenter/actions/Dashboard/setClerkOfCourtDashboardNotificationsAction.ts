import { getNotificationsAction } from '@web-client/presenter/actions/getNotificationsAction';
import { state } from '@web-client/presenter/app.cerebral';

// each load gets a number, so a response from an older load cannot overwrite a newer one
let latestRequestId = 0;

/**
 * Loads the user's notifications after the clerk of court dashboard renders.
 * The request runs in the background, so a failure must not go to the global
 * error handler: that would replace the dashboard, or a page the user opened
 * since, with the error page. A failure keeps the current notification counts.
 */
export const setClerkOfCourtDashboardNotificationsAction = async (
  props: ActionProps,
): Promise<void> => {
  const { get, store } = props;
  const requestId = ++latestRequestId;

  try {
    const { notifications } = await getNotificationsAction(props);

    // other pages load their own notifications, so do not overwrite them after the user leaves
    if (
      requestId !== latestRequestId ||
      get(state.currentPage) !== 'DashboardClerkOfCourt'
    ) {
      return;
    }
    store.set(state.notifications, notifications);
  } catch (e) {
    console.error('setClerkOfCourtDashboardNotificationsAction failed:', e);
  }
};
