import updateLoginValue from '../sequences/updateLoginValue';
import submitLogin from '../sequences/submitLogIn';
import gotoDashboard from '../sequences/gotoDashboard';

/**
 * Combine several sequences; set login value, and
 * continue with other sequences used when submitting login form
 * and navigating to dashboard
 *
 */
export default [...updateLoginValue, ...submitLogin, ...gotoDashboard];
