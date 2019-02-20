import { clearAlertsAction } from '../actions/clearAlertsAction';
import clearLoginForm from '../actions/clearLoginFormAction';
import setCurrentPage from '../actions/setCurrentPageAction';

export default [clearAlertsAction, clearLoginForm, setCurrentPage('LogIn')];
