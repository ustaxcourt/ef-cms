import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearCurrentPageHeaderAction } from '../actions/clearCurrentPageHeaderAction';
import { clearLoginFormAction } from '../actions/clearLoginFormAction';
import { clearUserAction } from '../actions/clearUserAction';
import { navigateToCognitoAction } from '../actions/navigateToCognitoAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const signOutSequence = [
  setCurrentPageAction('Interstitial'),
  clearCurrentPageHeaderAction,
  clearAlertsAction,
  clearUserAction,
  clearLoginFormAction,
  navigateToCognitoAction,
];
