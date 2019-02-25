import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearLoginFormAction } from '../actions/clearLoginFormAction';
import setCurrentPage from '../actions/setCurrentPageAction';

export const gotoLoginSequence = [
  clearAlertsAction,
  clearLoginFormAction,
  setCurrentPage('LogIn'),
];
