import { clearFormAction } from '../actions/clearFormAction';
import { getUserAction } from '../actions/getUserAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setUserOnFormAction } from '../actions/setUserOnFormAction';

export const gotoUserContactEditSequence = [
  setCurrentPageAction('Interstitial'),
  clearFormAction,
  getUserAction,
  setUserOnFormAction,
  setCurrentPageAction('UserContactEdit'),
];
