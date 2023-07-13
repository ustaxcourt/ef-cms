import { broadcastLogoutAction } from '../actions/broadcastLogoutAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearUserAction } from '../actions/clearUserAction';
import { deleteAuthCookieAction } from '../actions/deleteAuthCookieAction';
import { setCurrentPageAction } from '../actions/setupCurrentPageAction';

export const gotoIdleLogoutSequence = [
  setCurrentPageAction('Interstitial'),
  deleteAuthCookieAction,
  broadcastLogoutAction,
  clearModalAction,
  clearUserAction,
  setCurrentPageAction('IdleLogout'),
];
