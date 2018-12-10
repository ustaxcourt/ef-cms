import clearAlerts from '../actions/clearAlerts';
import clearLoginForm from '../actions/clearLoginForm';
import setCurrentPage from '../actions/setCurrentPage';

export default [clearAlerts, clearLoginForm, setCurrentPage('LogIn')];
