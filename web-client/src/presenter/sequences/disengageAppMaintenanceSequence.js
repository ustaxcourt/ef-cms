import { clearModalSequence } from './clearModalSequence';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { navigateToPathAction } from '../actions/navigateToPathAction';
import { navigateToPathSequence } from './navigateToPathSequence';
import { setMaintenanceModeAction } from '../actions/setMaintenanceModeAction';

export const disengageAppMaintenanceSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [
      clearModalSequence,
      setMaintenanceModeAction,
      navigateToPathSequence,
    ],
    unauthorized: [navigateToPathAction],
  },
];
