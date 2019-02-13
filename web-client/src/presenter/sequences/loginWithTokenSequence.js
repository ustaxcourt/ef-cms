import setUser from '../actions/setUserAction';
import getUser from '../actions/getUserAction';
// import updateLoginValueSequence from '../sequences/updateLoginValueSequence';
// import submitLogInSequence from '../sequences/submitLogInSequence';
import setPath from '../actions/setPathAction';
import navigateToPath from '../actions/navigateToPathAction';
import decodeToken from '../actions/decodeTokenAction';
import setToken from '../actions/setTokenAction';
/**
 * Combine several sequences; set login value, and
 * continue with other sequences used when submitting login form
 * and navigating to dashboard
 *
 */
export default [decodeToken, setToken, setUser, setPath, navigateToPath];
