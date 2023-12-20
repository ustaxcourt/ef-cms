import { clearModalSequence } from './clearModalSequence';
import { getUserAction } from '../actions/getUserAction';
import { navigateToPathSequence } from './navigateToPathSequence';
import { setMaintenanceModeAction } from '../actions/setMaintenanceModeAction';
import { setUserAction } from '../actions/setUserAction';
import { setUserPermissionsAction } from '../actions/setUserPermissionsAction';

export const disengageAppMaintenanceSequence = [
  getUserAction,
  setUserAction,
  setUserPermissionsAction,
  clearModalSequence,
  setMaintenanceModeAction,
  navigateToPathSequence,
];
