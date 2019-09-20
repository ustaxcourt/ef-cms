import { decodeTokenAction } from '../actions/decodeTokenAction';
import { getUserAction } from '../actions/getUserAction';
import { navigateToPathAction } from '../actions/navigateToPathAction';
import { setPathAction } from '../actions/setPathAction';
import { setTokenAction } from '../actions/setTokenAction';
import { setUserAction } from '../actions/setUserAction';
import { setupNotificationListenerAction } from '../actions/setupNotificationListenerAction';

/**
 * Combine several sequences; set login value, and
 * continue with other sequences used when submitting login form
 * and navigating to dashboard
 *
 */
export const loginWithTokenSequence = [
  decodeTokenAction,
  setTokenAction,
  getUserAction,
  setUserAction,
  setPathAction,
  navigateToPathAction,
  setupNotificationListenerAction,
];
