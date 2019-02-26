import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearLoginFormAction } from '../actions/clearLoginFormAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const gotoLoginSequence = [
  clearAlertsAction,
  clearLoginFormAction,
  setCurrentPageAction('LogIn'),
];
