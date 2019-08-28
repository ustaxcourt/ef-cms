import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getUserAction } from '../actions/getUserAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setUserAction } from '../actions/setUserAction';

export const gotoUserContactEditSequence = [
  setCurrentPageAction('Interstitial'),
  getUserAction,
  setUserAction,
  clearAlertsAction,
  setCurrentPageAction('UserContactEdit'),
];
