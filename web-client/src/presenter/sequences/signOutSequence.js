import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearLoginFormAction } from '../actions/clearLoginFormAction';
import { clearUserAction } from '../actions/clearUserAction';
import { navigateToCognitoAction } from '../actions/navigateToCognitoAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { stopWebSocketConnectionAction } from '../actions/WebSocketConnection/stopWebSocketConnectionAction';

export const signOutSequence = [
  setCurrentPageAction('Interstitial'),
  stopWebSocketConnectionAction,
  clearAlertsAction,
  clearUserAction,
  clearLoginFormAction,
  navigateToCognitoAction,
];
