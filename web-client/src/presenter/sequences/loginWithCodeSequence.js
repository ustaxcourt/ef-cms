import { authenticateCodeAction } from '../actions/authenticateCodeAction';
import { decodeTokenAction } from '../actions/decodeTokenAction';
import { getMaintenanceModeAction } from '../actions/getMaintenanceModeAction';
import { getUserAction } from '../actions/getUserAction';
import { navigateToMaintenanceAction } from '../actions/navigateToMaintenanceAction';
import { navigateToPathAction } from '../actions/navigateToPathAction';
import { setTokenAction } from '../actions/setTokenAction';
import { setUserAction } from '../actions/setUserAction';
import { setUserPermissionsAction } from '../actions/setUserPermissionsAction';
import { setupConfigSequence } from './setupConfigSequence';
import { startRefreshIntervalAction } from '../actions/startRefreshIntervalAction';

/**
 * Combine several sequences; set login value, and
 * continue with other sequences used when submitting login form
 * and navigating to dashboard
 *
 */
export const loginWithCodeSequence = [
  authenticateCodeAction,
  decodeTokenAction,
  setTokenAction,
  startRefreshIntervalAction,
  getMaintenanceModeAction,
  {
    maintenanceOff: [
      getUserAction,
      setUserAction,
      setUserPermissionsAction,
      setupConfigSequence,
      navigateToPathAction,
    ],
    maintenanceOn: [navigateToMaintenanceAction],
  },
];
