import { clearModalAction } from '../actions/clearModalAction';
import { clearUserAction } from '../actions/clearUserAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const gotoIdleLogoutSequence = [
  setCurrentPageAction('Interstitial'),
  clearModalAction,
  clearUserAction,
  setCurrentPageAction('IdleLogout'),
];
