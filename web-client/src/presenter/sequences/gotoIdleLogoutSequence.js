import { clearModalAction } from '../actions/clearModalAction';
import { clearUserAction } from '../actions/clearUserAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const gotoIdleLogoutSequence = [
  setCurrentPageAction('Interstitial'),
  // TODO 7501 - action to clear all timeout if it exists
  clearModalAction,
  clearUserAction,
  setCurrentPageAction('IdleLogout'),
];
