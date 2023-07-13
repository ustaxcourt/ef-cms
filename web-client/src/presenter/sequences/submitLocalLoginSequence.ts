import { clearAlertsAction } from '../actions/clearAlertsAction';
import { createTokenAction } from '../actions/createTokenAction';
import { decodeTokenAction } from '../actions/decodeTokenAction';
import { getAllFeatureFlagsAction } from '../actions/getAllFeatureFlagsAction';
import { getMaintenanceModeAction } from '../actions/getMaintenanceModeAction';
import { getUserAction } from '../actions/getUserAction';
import { navigateToMaintenanceAction } from '../actions/navigateToMaintenanceAction';
import { navigateToPathAction } from '../actions/navigateToPathAction';
import { setTokenAction } from '../actions/setTokenAction';
import { setUserAction } from '../actions/setUserAction';
import { setUserPermissionsAction } from '../actions/setUserPermissionsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const submitLocalLoginSequence = showProgressSequenceDecorator([
  createTokenAction,
  decodeTokenAction,
  setTokenAction,
  getUserAction,
  setUserAction,
  setUserPermissionsAction,
  getAllFeatureFlagsAction,
  getMaintenanceModeAction,
  {
    maintenanceOff: [clearAlertsAction, navigateToPathAction],
    maintenanceOn: [navigateToMaintenanceAction],
  },
]);
