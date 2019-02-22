import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearLoginFormAction } from '../actions/clearLoginFormAction';
import setCurrentPage from '../actions/setCurrentPageAction';

export default [
  clearAlertsAction,
  clearLoginFormAction,
  setCurrentPage('LogIn'),
];
