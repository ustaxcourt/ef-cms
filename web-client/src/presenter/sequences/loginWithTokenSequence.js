import { decodeTokenAction } from '../actions/decodeTokenAction';
import { setUser } from '../actions/setUserAction';
import { getUser } from '../actions/getUserAction';
import { setPath } from '../actions/setPathAction';
import { navigateToPath } from '../actions/navigateToPathAction';
import { setToken } from '../actions/setTokenAction';
/**
 * Combine several sequences; set login value, and
 * continue with other sequences used when submitting login form
 * and navigating to dashboard
 *
 */
export default [
  decodeTokenAction,
  setToken,
  getUser,
  setUser,
  setPath,
  navigateToPath,
];
