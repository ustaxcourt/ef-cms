import clearAlerts from '../actions/clearAlertsAction';
import clearLoginForm from '../actions/clearLoginFormAction';
import setCurrentPage from '../actions/setCurrentPageAction';

export default [clearAlerts, clearLoginForm, setCurrentPage('LogIn')];
