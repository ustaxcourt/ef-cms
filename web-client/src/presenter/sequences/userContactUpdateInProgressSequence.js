import { navigateToDashboardAction } from '../actions/navigateToDashboardAction';
import { set } from 'cerebral/factories';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { state } from 'cerebral';
import { stopWebSocketConnectionAction } from '../actions/webSocketConnection/stopWebSocketConnectionAction';

export const userContactUpdateInProgressSequence = [
  stopWebSocketConnectionAction,
  set(state.userContactEditProgress, {}),
  () => {
    return {
      alertError: {
        message: 'Update already in progress. Please try again later.',
        title: 'Update Error',
      },
    };
  },
  setSaveAlertsForNavigationAction,
  setAlertErrorAction,
  navigateToDashboardAction,
];
