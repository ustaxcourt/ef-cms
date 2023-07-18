import { broadcastLogoutAction } from '../actions/broadcastLogoutAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearUserAction } from '../actions/clearUserAction';
import { deleteAuthCookieAction } from '../actions/deleteAuthCookieAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';

export const gotoIdleLogoutSequence = [
  setupCurrentPageAction('Interstitial'),
  deleteAuthCookieAction,
  broadcastLogoutAction,
  clearModalAction,
  clearUserAction,
  setupCurrentPageAction('IdleLogout'),
];
