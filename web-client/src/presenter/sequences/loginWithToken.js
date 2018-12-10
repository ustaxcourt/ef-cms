import updateLoginValue from '../sequences/updateLoginValue';
import submitLogin from '../sequences/submitLogIn';
import setPath from '../actions/setPath';

/**
 * Combine several sequences; set login value, and
 * continue with other sequences used when submitting login form
 * and navigating to dashboard
 *
 */
export default [setPath, ...updateLoginValue, ...submitLogin];
