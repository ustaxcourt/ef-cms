import { authenticateUserAction } from '../actions/authenticateUserAction';
import { decodeTokenAction } from '../actions/decodeTokenAction';
import { getAllFeatureFlagsAction } from '../actions/getAllFeatureFlagsAction';
import { getUserAction } from '../actions/getUserAction';
import { navigateToPathAction } from '../actions/navigateToPathAction';
import { parallel } from 'cerebral';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setTokenAction } from '../actions/setTokenAction';
import { setUserAction } from '../actions/setUserAction';
import { setUserPermissionsAction } from '../actions/setUserPermissionsAction';
import { startRefreshIntervalAction } from '../actions/startRefreshIntervalAction';

/**
 * Combine several sequences; set login value, and
 * continue with other sequences used when submitting login form
 * and navigating to dashboard
 *
 */
export const loginWithCodeSequence = [
  authenticateUserAction,
  {
    no: [setAlertErrorAction],
    yes: [
      decodeTokenAction,
      setTokenAction,
      startRefreshIntervalAction,
      parallel([
        [getUserAction, setUserAction, setUserPermissionsAction],
        [getAllFeatureFlagsAction],
      ]),
      navigateToPathAction,
    ],
  },
];
