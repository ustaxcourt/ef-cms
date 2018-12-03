import updateLoginValue from '../sequences/updateLoginValue';
import submitLogin from '../sequences/submitLogIn';
import gotoDashboard from '../sequences/gotoDashboard';

export default [...updateLoginValue, ...submitLogin, ...gotoDashboard];
