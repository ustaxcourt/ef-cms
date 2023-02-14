import { decodeTokenAction } from '../actions/decodeTokenAction';
import { getMaintenanceModeAction } from '../actions/getMaintenanceModeAction';
import { getUserAction } from '../actions/getUserAction';
import { navigateToMaintenanceAction } from '../actions/navigateToMaintenanceAction';
import { navigateToPathAction } from '../actions/navigateToPathAction';
import { setTokenAction } from '../actions/setTokenAction';
import { setUserAction } from '../actions/setUserAction';
import { setUserPermissionsAction } from '../actions/setUserPermissionsAction';
import { setupConfigSequence } from '../sequences/setupConfigSequence';

/**
 * Combine several sequences; set login value, and
 * continue with other sequences used when submitting login form
 * and navigating to dashboard
 *
 */
export const loginWithTokenSequence = [
  decodeTokenAction,
  setTokenAction,
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
