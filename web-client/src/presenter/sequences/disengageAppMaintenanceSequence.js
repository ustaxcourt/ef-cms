import { clearModalSequence } from './clearModalSequence';
import { getUserAction } from '../actions/getUserAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { navigateToPathAction } from '../actions/navigateToPathAction';
import { navigateToPathSequence } from './navigateToPathSequence';
import { setMaintenanceModeAction } from '../actions/setMaintenanceModeAction';
import { setUserAction } from '../actions/setUserAction';
import { setUserPermissionsAction } from '../actions/setUserPermissionsAction';

export const disengageAppMaintenanceSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [
      getUserAction,
      setUserAction,
      setUserPermissionsAction,
      clearModalSequence,
      setMaintenanceModeAction,
      navigateToPathSequence,
    ],
    unauthorized: [navigateToPathAction],
  },
];
