import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearLoginFormAction } from '../actions/clearLoginFormAction';
import { clearUserAction } from '../actions/clearUserAction';
import { navigateToCognitoAction } from '../actions/navigateToCognitoAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const signOutSequence = [
  setCurrentPageAction('Interstitial'),
  clearAlertsAction,
  clearUserAction,
  clearLoginFormAction,
  navigateToCognitoAction,
];
