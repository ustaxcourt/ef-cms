import updateLoginValueSequence from '../sequences/updateLoginValueSequence';
import submitLogInSequence from '../sequences/submitLogInSequence';
import setPath from '../actions/setPath';

/**
 * Combine several sequences; set login value, and
 * continue with other sequences used when submitting login form
 * and navigating to dashboard
 *
 */
export default [setPath, ...updateLoginValueSequence, ...submitLogInSequence];
