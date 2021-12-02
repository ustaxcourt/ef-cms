import { broadcastLogoutAction } from '../actions/broadcastLogoutAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearLoginFormAction } from '../actions/clearLoginFormAction';
import { clearMaintenanceModeAction } from '../actions/clearMaintenanceModeAction';
import { clearUserAction } from '../actions/clearUserAction';
import { deleteAuthCookieAction } from '../actions/deleteAuthCookieAction';
import { navigateToCognitoAction } from '../actions/navigateToCognitoAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { stopWebSocketConnectionAction } from '../actions/WebSocketConnection/stopWebSocketConnectionAction';

export const signOutSequence = [
  setCurrentPageAction('Interstitial'),
  stopWebSocketConnectionAction,
  broadcastLogoutAction,
  deleteAuthCookieAction,
  clearAlertsAction,
  clearUserAction,
  clearMaintenanceModeAction,
  clearLoginFormAction,
  navigateToCognitoAction,
];
