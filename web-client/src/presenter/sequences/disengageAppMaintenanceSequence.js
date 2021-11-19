import { clearModalSequence } from './clearModalSequence';
import { getUserAction } from '../actions/getUserAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { navigateToPathAction } from '../actions/navigateToPathAction';
import { navigateToPathSequence } from './navigateToPathSequence';
import { setMaintenanceModeAction } from '../actions/setMaintenanceModeAction';
import { setUserAction } from '../actions/setUserAction';

export const disengageAppMaintenanceSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [
      getUserAction,
      setUserAction,
      clearModalSequence,
      setMaintenanceModeAction,
      navigateToPathSequence,
    ],
    unauthorized: [navigateToPathAction],
  },
];
