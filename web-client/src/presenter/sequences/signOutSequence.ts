import { broadcastLogoutAction } from '../actions/broadcastLogoutAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearLogoutTypeAction } from '@web-client/presenter/actions/clearLogoutTypeAction';
import { clearMaintenanceModeAction } from '../actions/clearMaintenanceModeAction';
import { clearUserAction } from '../actions/clearUserAction';
import { deleteAuthCookieAction } from '../actions/deleteAuthCookieAction';
import { resetIdleTimerAction } from '@web-client/presenter/actions/resetIdleTimerAction';
import { resetToBaseStateAction } from '@web-client/presenter/actions/Login/resetToBaseStateAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { stopWebSocketConnectionAction } from '../actions/WebSocketConnection/stopWebSocketConnectionAction';

export const signOutSequence = [
  setupCurrentPageAction('Interstitial'),
  stopWebSocketConnectionAction,
  broadcastLogoutAction,
  deleteAuthCookieAction,
  clearAlertsAction,
  clearUserAction,
  clearMaintenanceModeAction,
  clearLogoutTypeAction,
  resetIdleTimerAction,
  resetToBaseStateAction,
];
