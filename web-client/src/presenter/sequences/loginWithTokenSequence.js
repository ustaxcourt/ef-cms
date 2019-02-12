import setUser from '../actions/setUserAction';
// import updateLoginValueSequence from '../sequences/updateLoginValueSequence';
// import submitLogInSequence from '../sequences/submitLogInSequence';
import setPath from '../actions/setPathAction';
import decodeToken from '../actions/decodeTokenAction';
/**
 * Combine several sequences; set login value, and
 * continue with other sequences used when submitting login form
 * and navigating to dashboard
 *
 */
export default [
  setPath,
  decodeToken,
  setUser,
  // parse the token, put it into session storage, and put the user into state with the token on it

  // ...updateLoginValueSequence,
  //  ...submitLogInSequence];
]
