import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearLoginFormAction } from '../actions/clearLoginFormAction';
import { clearUserAction } from '../actions/clearUserAction';
import { navigateToCognito } from '../actions/navigateToCognitoAction';
import { setCurrentPage } from '../actions/setCurrentPageAction';

export const signOutSequence = [
  setCurrentPage('Loading'),
  clearAlertsAction,
  clearUserAction,
  clearLoginFormAction,
  navigateToCognito,
];
